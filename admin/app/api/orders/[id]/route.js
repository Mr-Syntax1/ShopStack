import { connectedToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment"; // برای حذف فاکتور (پرداخت) مرتبط با سفارش
import { NextResponse } from "next/server";

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

// ==============================
// بروزرسانی وضعیت سفارش
// ==============================
export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        const { status } = body;

        if (!status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: 'وضعیت ارسال‌شده معتبر نیست' },
                { status: 400 }
            );
        }

        await connectedToDatabase();

        const updated = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) {
            return NextResponse.json(
                { error: 'سفارش مورد نظر یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error('خطا در بروزرسانی سفارش:', error);
        return NextResponse.json(
            { error: 'خطا در بروزرسانی سفارش', details: error.message },
            { status: 500 }
        );
    }
}

// ==============================
// حذف سفارش
// ==============================
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        await connectedToDatabase();

        const deleted = await Order.findByIdAndDelete(id).lean();

        if (!deleted) {
            return NextResponse.json(
                { error: 'سفارش مورد نظر یافت نشد' },
                { status: 404 }
            );
        }

        // حذف فاکتور (پرداخت) مرتبط با این سفارش تا رکورد یتیم نماند
        // orderId از نوع ObjectId است و مقدار id (رشته) توسط mongoose به ObjectId تبدیل می‌شود
        await Payment.deleteOne({ orderId: id }).catch(() => { });

        return NextResponse.json(
            { message: 'سفارش با موفقیت حذف شد', id },
            { status: 200 }
        );

    } catch (error) {
        console.error('خطا در حذف سفارش:', error);
        return NextResponse.json(
            { error: 'خطا در حذف سفارش', details: error.message },
            { status: 500 }
        );
    }
}
