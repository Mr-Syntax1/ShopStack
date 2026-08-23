// 4 PRODUCTS FOR RELATED PRODUCTS

import { connectedToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectedToDatabase();

        const { slug } = await params;
        const decodedSlug = decodeURIComponent(slug);

        // ۱. محصول اصلی رو پیدا کن
        const product = await Product.findOne({ slug: decodedSlug })
        if (!product) {
            return NextResponse.json(
                { error: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        // ============================================
        // ۲. محصولات مرتبط از همان دسته (حداکثر ۴ تا)
        // نکته مهم: _id و id رو هم باید انتخاب کنی
        // چون در صفحه جزئیات محصول، دکمه "افزودن به سبد خرید"
        // نیاز به این شناسه‌ها داره تا CartContext بتونه آیتم رو مدیریت کنه
        // و در نهایت وقتی سفارش ثبت میشه، productId لازم هست
        // قبلا فقط title slug image price discount انتخاب میشد
        // که باعث می‌شد _id وجود نداشته باشه و سفارش با خطای
        // "productId is required" مواجه بشه
        // ============================================
        const relatedProducts = await Product.find({
            category: product.category,
            slug: { $ne: decodedSlug }
        })
            .limit(4)
            .select('title slug image price discount _id id')
            .lean();

        return NextResponse.json(relatedProducts, { status: 200 });

    } catch (error) {
        console.error('خطا در دریافت محصولات مرتبط:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت محصولات مرتبط' },
            { status: 500 }
        );
    }
}
