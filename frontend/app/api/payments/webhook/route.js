// =============================================================
// گیرنده اطلاع‌رسانی خودکار بلوپال پس از پرداخت موفق.
//
// نکات مهم مستندات:
//   • باید در کمتر از ۱۰ ثانیه پاسخ HTTP 200 بدهد
//   • وبهوک ممکن است چندین بار ارسال شود → منطق Idempotent داشته باشید
//   • همیشه invoice_id را با دیتابیس خود اعتبارسنجی کنید
//   • تمام وبهوک‌ها را لاگ بگیرید
//
// تنظیمات: آدرس این endpoint را در پنل بلوپال (بخش API Key → Webhook URL)
// ثبت کنید، مثلاً: https://DOMAIN/api/payments/webhook
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
    let payload = null;
    try {
        payload = await req.json();
    } catch {
        // بدنه نامعتبر → ۴۰۰ (بلوپال بعداً retry می‌کند)
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // لاگ‌گیری برای ردیابی در صورت بروز مشکل
    console.log('[BluePal Webhook] received:', JSON.stringify(payload));

    // فقط رویداد پرداخت موفق را می‌پذیریم
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

        // ---- به‌روزرسانی تراکنش پرداخت ----
        payment.status = 'PAID';
        payment.transactionId = payload.transaction_id ?? null;
        payment.finalAmount = payload.final_amount;
        payment.paidAt = new Date();
        payment.payer = {
            name: payload.payer_name ?? null,
            card: payload.payer_card ?? null,
            bankName: payload.payer_bank_name ?? null,
        };
        payment.mode = payload.mode || payment.mode;
        await payment.save();

        // ---- به‌روزرسانی سفارش مرتبط ----
        await Order.findByIdAndUpdate(payment.orderId, {
            status: 'processing', // از pending به در حال پردازش (پرداخت‌شده)
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

        // پاسخ موفق و سریع (کمتر از ۱۰ ثانیه)
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('[BluePal Webhook] processing error:', error);
        // خطای داخلی → ۵۰۰ تا بلوپال طبق مستندات تلاش مجدد کند
        return NextResponse.json({ error: 'processing_error' }, { status: 500 });
    }
}