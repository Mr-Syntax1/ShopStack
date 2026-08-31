// =============================================================
// getInvoice
// شبیه‌سازی میکنه
// بررسی وضعیت فاکتور از بلوپال و همگام‌سازی با دیتابیس محلی.
// خروجی شامل وضعیت فاکتور و اطلاعات پرداخت‌کننده (در صورت پرداخت) است.
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getInvoice } from "@/lib/blupal";
// تابع دریافت وضعیت فاکتور از بلوپال 
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
    try {
        const { invoiceId } = await params;
        const id = Number(invoiceId);

        if (!id) {
            return NextResponse.json({ error: 'شناسه فاکتور نامعتبر است' }, { status: 400 });
        }

        await connectedToDatabase();

        // دریافت وضعیت تازه از بلوپال
        const remote = await getInvoice(id);

        // همگام‌سازی رکورد محلی با پاسخ بلوپال
        const update = {
            status: remote.status,
            finalAmount: remote.final_amount,
            transactionId: remote.transaction_id ?? null,
            mode: remote.mode,
        };

        if (remote.status === 'PAID') {
            update.paidAt = new Date();
            update.payer = {
                name: remote.payer_name ?? null,
                card: remote.payer_card ?? null,
                bankName: remote.payer_bank_name ?? null,
            };
        }

        const payment = await Payment.findOneAndUpdate({ invoiceId: id }, update, { returnDocument: 'after' }).lean();
        //.lean() یعنی به صورت شیء ساده برگردون (نه شیء سنگین Mongoose)

        // همگام‌سازی وضعیت سفارش با پرداخت: وقتی فاکتور PAID شد، سفارش را هم به‌روز کن
        // (اینجوری مدل پرداخت با مدل سفارش «تماس» می‌گیرد و وضعیت ادمین درست می‌شه)
        if (remote.status === 'PAID' && payment?.orderId) {
            const existingOrder = await Order.findById(payment.orderId).lean();
            const alreadyProcessed = existingOrder?.status === 'processing';

            await Order.findByIdAndUpdate(payment.orderId, {
                status: 'processing', // سفارش پرداخت‌شده → در حال پردازش
                payment: {
                    invoiceId: payment.invoiceId,
                    status: 'PAID',
                    mode: payment.mode,
                    cardNumber: payment.cardNumber || null,
                    transactionId: payment.transactionId,
                    payerName: payment.payer?.name ?? null,
                    payerCard: payment.payer?.card ?? null,
                    payerBankName: payment.payer?.bankName ?? null,
                    paidAt: payment.paidAt,
                },
            }).catch(() => { });
            // اگر خطایی پیش اومد پولینگ رو متوقف نکنیم؛ فقط لاگ می‌شه

            if (!alreadyProcessed && existingOrder?.cart?.length) {
                const bulkOps = existingOrder.cart.map((item) => ({
                    updateOne: {
                        filter: { _id: item.productId },
                        update: { $inc: { stock: -item.quantity } },
                    },
                }));
                await Product.bulkWrite(bulkOps);
            }
        }

        return NextResponse.json({
            success: true,
            invoiceId: id,
            status: remote.status,
            amount: remote.amount,
            finalAmount: remote.final_amount,
            mode: remote.mode,
            paymentLink: payment?.paymentLink || null,
            payer: remote.status === 'PAID'
                ? { name: remote.payer_name, card: remote.payer_card, bankName: remote.payer_bank_name }
                : null,
            orderId: payment?.orderId ? String(payment.orderId) : null,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/payments/[invoiceId]:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت وضعیت فاکتور', details: error.message },
            { status: 500 }
        );
    }
}
