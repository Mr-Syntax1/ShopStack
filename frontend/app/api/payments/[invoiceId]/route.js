// =============================================================
// GET /api/payments/[invoiceId]
// -------------------------------------------------------------
// بررسی وضعیت فاکتور از بلوپال و همگام‌سازی با دیتابیس محلی.
// خروجی شامل وضعیت فاکتور و اطلاعات پرداخت‌کننده (در صورت پرداخت) است.
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { getInvoice } from "@/lib/blupal";
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
        const payment = await Payment.findOneAndUpdate({ invoiceId: id }, update, { new: true }).lean();

        return NextResponse.json({
            success: true,
            invoiceId: id,
            status: remote.status,
            amount: remote.amount,
            finalAmount: remote.final_amount,
            mode: remote.mode,
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
