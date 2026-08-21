// =============================================================
// POST /api/payments/[invoiceId]/simulate
// -------------------------------------------------------------
// فقط محیط Sandbox - برای تست جریان پرداخت بدون کارت واقعی.
// بدنه: { scenario }  (پیش‌فرض: success)
// scenarioها: success | wrong_amount | expire | cancel
//
// پس از موفقیت (scenario=success)، رکورد محلی را به‌روز می‌کند
// تا بتوان وضعیت پرداخت را در فروشگاه دید.
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { simulatePayment } from "@/lib/blupal";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    try {
        const { invoiceId } = await params;
        const id = Number(invoiceId);
        const { scenario } = await req.json().catch(() => ({}));

        if (!id) {
            return NextResponse.json({ error: 'شناسه فاکتور نامعتبر است' }, { status: 400 });
        }

        await connectedToDatabase();

        const result = await simulatePayment(id, scenario || 'success');

        // همگام‌سازی رکورد محلی (مثلاً PAID پس از success)
        await Payment.findOneAndUpdate(
            { invoiceId: id },
            { status: result.status, transactionId: result.transaction_id ?? null }
        ).catch(() => {});

        return NextResponse.json({
            success: true,
            invoiceId: id,
            status: result.status,
            transactionId: result.transaction_id ?? null,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in POST /api/payments/[invoiceId]/simulate:', error);
        return NextResponse.json(
            { error: error.message || 'خطا در شبیه‌سازی پرداخت' },
            { status: 500 }
        );
    }
}
