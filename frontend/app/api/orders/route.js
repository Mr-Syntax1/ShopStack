import { connectedToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

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