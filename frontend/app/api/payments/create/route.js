// =============================================================
// فاکتور میسازه

// ورودی: { user, cart, totalPrice }  (totalPrice به تومان)
// خروجی: { paymentLink, invoiceId, orderId, mode, finalAmount }
//
// جریان:
//   ۱) اعتبارسنجی سبد خرید
//   ۲) ساخت سفارش (وضعیت pending)
//   ۳) ساخت فاکتور در بلوپال (تبدیل تومان → ریال)
//   ۴) ذخیره تراکنش پرداخت و برگرداندن لینک پرداخت
// =============================================================
import { connectedToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import { createInvoice, getBlupalMode, tomanToRial } from "@/lib/blupal";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectedToDatabase();

        const { user, cart, totalPrice } = await req.json();

        // ---- اعتبارسنجی سبد خرید ----
        if (!Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'سبد خرید خالی است' }, { status: 400 });
        }
        const invalidItems = cart.filter((item) => !item.productId);
        if (invalidItems.length > 0) {
            return NextResponse.json(
                { error: 'برخی محصولات سبد خرید شناسه معتبر ندارند.' },
                { status: 400 }
            );
        }

        const rial = tomanToRial(totalPrice);

        // ---- ساخت سفارش در دیتابیس (وضعیت اولیه: در انتظار پرداخت) ----
        const mappedCart = cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            slug: item.slug,
            price: item.price,
            discount: item.discount || 0,
            quantity: item.quantity,
            image: item.image,
        }));

        const order = new Order({
            user,
            cart: mappedCart,
            totalPrice: totalPrice || 0,
            status: 'pending',
        });
        await order.save();

        // ---- ساخت فاکتور در بلوپال ----
        // اگر ساخت فاکتور شکست خورد، سفارش یتیم باقی نماند → حذف می‌کنیم
        let invoice;
        try {
            invoice = await createInvoice({ amount: totalPrice });
        } catch (err) {
            await Order.findByIdAndDelete(order._id).catch(() => { });
            // تا فاکتور یتیم ن مونه
            return NextResponse.json(
                { error: err.message || 'خطا در ایجاد فاکتور پرداخت' },
                { status: 502 }
            );
        }

        // ---- ذخیره تراکنش پرداخت ----
        const payment = new Payment({
            orderId: order._id,
            invoiceId: invoice.invoice_id,
            amount: rial,
            finalAmount: invoice.final_amount,
            status: invoice.status,                 // معمولاً PENDING
            mode: invoice.mode || getBlupalMode(),
            paymentLink: invoice.payment_link,
            cardNumber: invoice.card_number || '',
            expiresAt: invoice.expires_at ? new Date(invoice.expires_at) : null,
        });
        await payment.save();

        // ثبت ارجاع فاکتور روی خودِ سفارش (برای نمایش در پنل ادمین)
        order.payment = {
            invoiceId: invoice.invoice_id,
            status: invoice.status,
            mode: payment.mode,
            cardNumber: invoice.card_number || payment.cardNumber || '', // شماره کارت مقصد
        };
        await order.save();

        return NextResponse.json({
            success: true,
            paymentLink: invoice.payment_link,
            invoiceId: invoice.invoice_id,
            orderId: String(order._id),
            mode: payment.mode,
            finalAmount: invoice.final_amount,
        }, { status: 200 });

    } catch (error) {
        console.error('Error in POST /api/payments/create:', error);
        return NextResponse.json(
            { error: 'خطا در آغاز فرایند پرداخت', details: error.message },
            { status: 500 }
        );
    }
}
