// =============================================================
// GET /api/payments/order/[orderId]
// وضعیت سفارش رو میگیره

// دریافت وضعیت پرداخت یک سفارش بر اساس شناسه سفارش (برای صفحه پرداخت).
// ابتدا رکورد محلی را برمی‌گرداند؛ اگر هنوز PENDING باشد،
// وضعیت تازه را از بلوپال استعلام می‌کند تا همگام بماند.
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { getInvoice } from "@/lib/blupal";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
    try {
        const { orderId } = await params;

        await connectedToDatabase();

        let payment = await Payment.findOne({ orderId }).lean();
        if (!payment) {
            return NextResponse.json({ error: 'پرداختی برای این سفارش یافت نشد' }, { status: 404 });
        }

        // اگر هنوز پرداخت نشده، وضعیت تازه را از بلوپال بپرس
        // (مثلاً وقتی کاربر دستی به صفحه وضعیت برگردد)
        if (payment.status === 'PENDING') {
            try {
                const remote = await getInvoice(payment.invoiceId);
                const remoteCard = remote.card_number ?? remote.cardNumber ?? null;
                // اگر بلوپال شماره کارت مقصد را برگردانده، حتی اگر status تغییر نکرده، آن را ذخیره کن (رفع باگ نمایش خالی)
                if (remoteCard && !payment.cardNumber) {
                    payment = await Payment.findOneAndUpdate(
                        { invoiceId: payment.invoiceId },
                        { cardNumber: String(remoteCard) },
                        { returnDocument: 'after' }
                    ).lean();
                }
                if (remote.status !== payment.status) {
                    const update = { status: remote.status, finalAmount: remote.final_amount };
                    if (remoteCard) update.cardNumber = String(remoteCard);
                    if (remote.status === 'PAID') {
                        update.paidAt = new Date();
                        update.payer = {
                            name: remote.payer_name ?? null,
                            card: remote.payer_card ?? null,
                            bankName: remote.payer_bank_name ?? null,
                        };
                    }
                    payment = await Payment.findOneAndUpdate(
                        { invoiceId: payment.invoiceId },
                        update,
                        { returnDocument: 'after' }
                    ).lean();
                } else if (remoteCard && remoteCard !== payment.cardNumber) {
                    // status یکسان ولی cardNumber جدید است
                    payment = await Payment.findOneAndUpdate(
                        { invoiceId: payment.invoiceId },
                        { cardNumber: String(remoteCard) },
                        { returnDocument: 'after' }
                    ).lean();
                }
            } catch {
                // در صورت خطای موقت بلوپال، وضعیت محلی را نگه می‌داریم
            }
        }

        return NextResponse.json({
            success: true,
            orderId,
            invoiceId: payment.invoiceId,
            status: payment.status,
            mode: payment.mode,
            amount: payment.amount,
            finalAmount: payment.finalAmount,
            paymentLink: payment.paymentLink,
            cardNumber: payment.cardNumber || null,
            payer: payment.status === 'PAID' ? payment.payer : null,
            paidAt: payment.paidAt || null,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/payments/order/[orderId]:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت وضعیت پرداخت' },
            { status: 500 }
        );
    }
}
