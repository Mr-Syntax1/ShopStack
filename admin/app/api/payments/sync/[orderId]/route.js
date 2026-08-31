// =============================================================
// POST /api/payments/sync/[orderId]
// -------------------------------------------------------------
// همگام‌سازی دستی وضعیت پرداخت یک سفارش با بلوپال.
// وقتی وبهوک به هر دلیل (مثلاً localhost یا ثبت‌نشدن آدرس)
// به سرور نرسیده باشد، ادمین می‌تواند با این دکمه وضعیت را
// مستقیماً از بلوپال استعلام و بروزرسانی کند.
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Product from "@/models/Product";
import { getInvoice } from "@/lib/blupal";
import { NextResponse } from "next/server";

export async function POST(_req, { params }) {
    try {
        const { orderId } = await params;

        await connectedToDatabase();

        const order = await Order.findById(orderId).lean();
        if (!order) {
            return NextResponse.json({ error: 'سفارش یافت نشد' }, { status: 404 });
        }

        const invoiceId = order.payment?.invoiceId;
        if (!invoiceId) {
            return NextResponse.json({ error: 'این سفارش فاکتور پرداخت ندارد' }, { status: 400 });
        }

        // استعلام وضعیت تازه از بلوپال
        const remote = await getInvoice(invoiceId);

        const update = {
            'payment.status': remote.status,
            'payment.mode': remote.mode,
            'payment.finalAmount': remote.final_amount,
            'payment.transactionId': remote.transaction_id ?? null,
        };
        if (remote.status === 'PAID') {
            update['payment.paidAt'] = new Date();
            update['payment.payerName'] = remote.payer_name ?? null;
            update['payment.payerCard'] = remote.payer_card ?? null;
            update['payment.payerBankName'] = remote.payer_bank_name ?? null;
            // سفارش را به «در حال پردازش» ارتقا بده (پرداخت انجام شده)
            update.status = 'processing';
        }

        const alreadyProcessed = order.status === 'processing';
        await Order.findByIdAndUpdate(orderId, update).lean();

        if (!alreadyProcessed && order.cart?.length && remote.status === 'PAID') {
            const bulkOps = order.cart.map((item) => ({
                updateOne: {
                    filter: { _id: item.productId },
                    update: { $inc: { stock: -item.quantity } },
                },
            }));
            await Product.bulkWrite(bulkOps);
        }

        // همگام‌سازی رکورد پرداخت نیز (در صورت وجود)
        await Payment.findOneAndUpdate(
            { invoiceId },
            {
                status: remote.status,
                finalAmount: remote.final_amount,
                transactionId: remote.transaction_id ?? null,
                mode: remote.mode,
                ...(remote.status === 'PAID' ? {
                    paidAt: new Date(),
                    payer: {
                        name: remote.payer_name ?? null,
                        card: remote.payer_card ?? null,
                        bankName: remote.payer_bank_name ?? null,
                    }
                } : {})
            }
        ).catch(() => {});

        return NextResponse.json({
            success: true,
            invoiceId,
            status: remote.status,
            orderStatus: remote.status === 'PAID' ? 'processing' : order.status,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in POST /api/payments/sync/[orderId]:', error);
        return NextResponse.json(
            { error: error.message || 'خطا در همگام‌سازی با بلوپال' },
            { status: 500 }
        );
    }
}
