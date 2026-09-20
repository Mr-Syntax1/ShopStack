// =============================================================
// گیرنده اطلاعرسانی خودکار بلوپال پس از پرداخت موفق.
// پرداخت رو دریافت میکنه
// بلوپال خودش این رو صدا میزنه وقتی پرداخت تموم شد

// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getInvoice } from "@/lib/blupal";
import { NextResponse } from "next/server";

export async function POST(req) {
    let payload = null;
    try {
        payload = await req.json();
    } catch {
        // بدنه نامعتبر → ۴۰۰ (بلوپال بعداً retry میکند)
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // لاگگیری برای ردیابی در صورت بروز مشکل
    console.log('[BluePal Webhook] received:', JSON.stringify(payload));

    // فقط رویداد پرداخت موفق را میپذیریم
    if (!payload || payload.event !== 'payment.completed' || payload.status !== 'PAID') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const invoiceId = Number(payload.invoice_id);

    try {
        await connectedToDatabase();

        const payment = await Payment.findOne({ invoiceId });

        // اعتبارسنجی: فاکتور باید متعلق به فروشگاه ما باشد
        if (!payment) {
            console.warn('[BluePal Webhook] invoice not found:', invoiceId);
            return NextResponse.json({ error: 'not_found' }, { status: 404 });
        }

        // ---- Idempotency: اگر قبلاً پرداخت شده، همان ۲۰۰ را سریع برگردان ----
        if (payment.status === 'PAID') {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // ---- لایه ۲: بازخوانی فاکتور از خود بلوپال ----
        // این کار باعث میشود وبهوک جعلی (با invoice_id حدسی) رد شود،
        // چون فقط بلوپال میتواند وضعیت واقعی PAID را تأیید کند.
        const remote = await getInvoice(invoiceId);

        if (remote.status !== 'PAID') {
            console.warn('[BluePal Webhook] remote status is not PAID:', remote.status);
            // وضعیت هنوز پرداخت نشده → ۴۰۰ تا بلوپال دوباره تلاش نکند (چون رویداد PAID بود ولی تأیید نشد)
            return NextResponse.json({ error: 'not_paid' }, { status: 400 });
        }

        // تطبیق مبلغ نهایی با رکورد محلی (جلوگیری از دستکاری مبلغ)
        if (
            remote.final_amount != null &&// بلوپال
            payment.finalAmount != null &&// محلی
            Number(remote.final_amount) !== Number(payment.finalAmount)
        ) {
            console.error('[BluePal Webhook] amount mismatch:', {
                remote: remote.final_amount,
                local: payment.finalAmount,
            });
            return NextResponse.json({ error: 'amount_mismatch' }, { status: 400 });
        }

        //=============================================
        //         به روزرسانی تراکنش پرداخت 
        //=============================================
        payment.status = 'PAID';
        payment.transactionId = remote.transaction_id ?? payload.transaction_id ?? null;
        payment.finalAmount = remote.final_amount ?? payment.finalAmount;
        payment.paidAt = new Date();
        payment.payer = {
            name: remote.payer_name ?? payload.payer_name ?? null,
            card: remote.payer_card ?? payload.payer_card ?? null,
            bankName: remote.payer_bank_name ?? payload.payer_bank_name ?? null,
        };
        payment.mode = remote.mode || payload.mode || payment.mode;
        // شماره کارت مقصد (کارتی که باید به آن واریز شود) - از پاسخ بلوپال همگام می‌شود تا باگ نمایش خالی رفع شود
        const webhookCardNumber = remote.card_number ?? remote.cardNumber ?? payload.card_number ?? null;
        if (webhookCardNumber) payment.cardNumber = String(webhookCardNumber);
        await payment.save();

        // ---- به روزرسانی سفارش مرتبط ----
        await Order.findByIdAndUpdate(payment.orderId, {
            status: 'processing', // از pending به در حال پردازش (پرداخت شده)
            payment: {
                invoiceId: payment.invoiceId,
                status: 'PAID',
                mode: payment.mode,
                cardNumber: payment.cardNumber || null, // شماره کارت مقصد
                transactionId: payment.transactionId,
                payerName: payment.payer.name,
                payerCard: payment.payer.card,
                payerBankName: payment.payer.bankName,
                paidAt: payment.paidAt,
            },
        });

        // ---- کم کردن موجودی محصولات بر اساس سبد خرید ----
        const orderForStock = await Order.findById(payment.orderId).lean();
        if (orderForStock?.cart?.length) {
            const bulkOps = orderForStock.cart.map((item) => ({
                updateOne: {
                    filter: { _id: item.productId },
                    update: { $inc: { stock: -item.quantity } },
                },
            }));
            await Product.bulkWrite(bulkOps);
        }

        // پاسخ موفق و سریع (کمتر از ۱۰ ثانیه)
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('[BluePal Webhook] processing error:', error);
        // خطای داخلی → ۵۰۰ تا بلوپال طبق مستندات تلاش مجدد کند
        return NextResponse.json({ error: 'processing_error' }, { status: 500 });
    }
}