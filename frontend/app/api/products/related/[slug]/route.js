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
        const product = await Product.findOne({ slug: decodedSlug });
        if (!product) {
            return NextResponse.json(
                { error: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        // ۲. محصولات مرتبط از همان دسته (حداکثر ۴ تا)
        const relatedProducts = await Product.find({
            category: product.category,// same category
            slug: { $ne: decodedSlug } // غیر از خودش
        })
            .limit(4)
            .select('title slug image price discount') // فقط فیلدهای لازم
            .lean(); // تبدیل به Object ساده برای سرعت بیشتر

        return NextResponse.json(relatedProducts, { status: 200 });

    } catch (error) {
        console.error('خطا در دریافت محصولات مرتبط:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت محصولات مرتبط' },
            { status: 500 }
        );
    }
}
