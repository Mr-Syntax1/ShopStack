import { connectedToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ==============================
// دریافت سفارشات کاربر جاری
// ==============================
export async function GET() {
    try {
        await connectedToDatabase();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
        }

        const decoded = getUserFromToken(token);
        if (!decoded) {
            return NextResponse.json({ error: "توکن نامعتبر" }, { status: 401 });
        }

        const orders = await Order.find({ "user.email": decoded.email })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("خطا در دریافت سفارشات:", error);
        return NextResponse.json(
            { error: "خطا در دریافت سفارشات", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectedToDatabase()

        const { user, cart, totalPrice, status, createdAt } = await req.json()

        if (!Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ message: 'سبد خرید خالی است' }, { status: 400 })
        }

        const invalidItems = cart.filter((item) => !item.productId)
        if (invalidItems.length > 0) {
            return NextResponse.json(
                { message: 'برخی محصولات سبد خرید شناسه معتبر ندارند. لطفاً سبد خرید را بررسی کنید.' },
                { status: 400 }
            )
        }

        const mappedCart = cart.map((item) => {
            const productId = item.productId
            return {
                productId,
                title: item.title,
                slug: item.slug,
                price: item.price,
                discount: item.discount || 0,
                quantity: item.quantity,
                image: item.image,
            }
        })

        const newOrder = new Order({
            user,
            cart: mappedCart,
            totalPrice: totalPrice || 0,
            status: status || 'pending',
            createdAt: createdAt || new Date()
        })

        await newOrder.save()

        return NextResponse.json({ message: 'سفارش با موفقیت ثبت شد' }, { status: 201 })

    } catch (error) {
        console.error('Error in POST /api/orders:', error)

        return NextResponse.json(
            {
                message: 'خطا در ثبت سفارش',
                error: error.message
            },
            { status: 500 }
        )
    }
}