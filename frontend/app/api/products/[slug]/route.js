// JUST ONE PRODUCT

import { connectedToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectedToDatabase();
        const { slug } = await params;
        const decodedSlug = decodeURIComponent(slug);
        const product = await Product.findOne({ slug: decodedSlug });

        if (!product) {
            return NextResponse.json({ error: 'محصول یافت نشد' }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'خطا در دریافت محصول' }, { status: 500 });
    }
}