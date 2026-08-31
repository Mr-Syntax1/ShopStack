// =============================================================
// فقط محیط Sandbox - برای تست جریان پرداخت بدون کارت واقعی.
// بدنه: { scenario }  (پیش‌فرض: success)
// scenarioها: success | wrong_amount | expire | cancel
// پس از موفقیت (scenario=success)، رکورد محلی را به‌روز می‌کند
// تا بتوان وضعیت پرداخت را در فروشگاه دید.
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Order from "@/models/Order";
import Product from "@/models/Product";
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

        // یافتن رکورد محلی برای دسترسی به orderId (جهت همگام‌سازی سفارش)
        const local = await Payment.findOne({ invoiceId: id }).lean();

        const patch = {
            status: result.status,
            transactionId: result.transaction_id ?? null,
        };
        if (result.status === 'PAID') {
            patch.paidAt = new Date(); // زمان پرداخت موفق (شبیه‌سازی)
        }

        // همگام‌سازی رکورد محلی (مثلاً PAID پس از success)
        await Payment.findOneAndUpdate(
            { invoiceId: id },
            patch
        ).catch(() => { });

        // در محیط Sandbox وبهوک معمولاً نمی‌رسد؛ پس وضعیت سفارش را هم دستی بروزرسانی کن
        if (local?.orderId && result.status === 'PAID') {
            const existingOrder = await Order.findById(local.orderId).lean();
            const alreadyProcessed = existingOrder?.status === 'processing';

            await Order.findByIdAndUpdate(local.orderId, {
                status: 'processing',
                'payment.status': 'PAID',
                'payment.paidAt': patch.paidAt,
                'payment.transactionId': patch.transactionId,
            }).catch(() => { });

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
