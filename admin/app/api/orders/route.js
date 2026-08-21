import { connectedToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// ==============================
// دریافت همه سفارشات (برای ادمین)
// ==============================
export async function GET() {
    try {
        await connectedToDatabase();

        const orders = await Order.find({})
            .sort({ createdAt: -1 }) // جدیدترین اول
            .lean(); // برای افزایش سرعت

        return NextResponse.json(orders, { status: 200 });

    } catch (error) {

        console.error(' خطا در دریافت سفارشات:', error);

        //  برگردوندن پیام خطا به کلاینت
        return NextResponse.json(
            {
                error: 'خطا در دریافت سفارشات',
                details: error.message
            },
            { status: 500 }
        );
    }
}