// =============================================================
// getInvoice

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
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(_req, { params }) {
    try {
        const { invoiceId } = await params;
        const id = Number(invoiceId);

        if (!id) {
            return NextResponse.json({ error: 'شناسه فاکتور نامعتبر است' }, { status: 400 });
        }

        await connectedToDatabase();

        // بررسی احراز هویت
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'لطفاً وارد شوید' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'توکن نامعتبر' },
                { status: 401 }
            );
        }

        const payment = await Payment.findOne({ invoiceId: id }).lean();
        // const payment = await Payment.findOneAndUpdate({ invoiceId: id }, update, { returnDocument: 'after' }).lean();

        if (!payment) {
            return NextResponse.json(
                { error: 'فاکتور یافت نشد' },
                { status: 404 }
            );
        }

        // فقط خود کاربر یا ادمین می‌توانند فاکتور را ببینند
        if (payment.userId?.toString() !== decoded.userId && decoded.role !== 'admin') {
            return NextResponse.json(
                { error: 'شما دسترسی به این فاکتور ندارید' },
                { status: 403 }
            );
        }

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

        // بعد به‌روزرسانی با findOneAndUpdate
        const updatedPayment = await Payment.findOneAndUpdate(
            { invoiceId: id },
            update,
            { returnDocument: 'after' }
        ).lean();


        //.lean() یعنی به صورت شیء ساده برگردون (نه شیء سنگین Mongoose)

        // همگام‌سازی وضعیت سفارش با پرداخت: وقتی فاکتور PAID شد، سفارش را هم به‌روز کن
        // (اینجوری مدل پرداخت با مدل سفارش «تماس» می‌گیرد و وضعیت ادمین درست می‌شه)
        if (remote.status === 'PAID' && updatedPayment?.orderId) {
            const existingOrder = await Order.findById(updatedPayment.orderId).lean();
            const alreadyProcessed = existingOrder?.status === 'processing';

            await Order.findByIdAndUpdate(updatedPayment.orderId, {
                status: 'processing', // سفارش پرداخت‌شده → در حال پردازش
                payment: {
                    invoiceId: updatedPayment.invoiceId,
                    status: 'PAID',
                    mode: updatedPayment.mode,
                    cardNumber: updatedPayment.cardNumber || null,
                    transactionId: updatedPayment.transactionId,
                    payerName: updatedPayment.payer?.name ?? null,
                    payerCard: updatedPayment.payer?.card ?? null,
                    payerBankName: updatedPayment.payer?.bankName ?? null,
                    paidAt: updatedPayment.paidAt,
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
            paymentLink: updatedPayment?.paymentLink || null,
            payer: remote.status === 'PAID'
                ? { name: remote.payer_name, card: remote.payer_card, bankName: remote.payer_bank_name }
                : null,
            orderId: updatedPayment?.orderId ? String(updatedPayment.orderId) : null,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/payments/[invoiceId]:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت وضعیت فاکتور', details: error.message },
            { status: 500 }
        );
    }
}
