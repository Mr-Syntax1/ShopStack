// app/api/products/[slug]/route.js
import { connectedToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// ==============================
// DELETE: حذف محصول
// ==============================
export async function DELETE(req, { params }) {
    try {
        await connectedToDatabase();
        const { slug } = await params;

        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { error: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        await product.deleteOne();

        return NextResponse.json(
            {
                message: 'محصول با موفقیت حذف شد',
                product
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('❌ Delete error:', error);
        return NextResponse.json(
            { error: 'خطا در حذف محصول' },
            { status: 500 }
        );
    }
}

// ==============================
// PUT: ویرایش محصول
// ==============================
export async function PUT(req, { params }) {
    try {
        await connectedToDatabase();

        const { slug } = await params;
        const data = await req.json();

        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { error: 'محصولی با این slug یافت نشد' },
                { status: 404 }
            );
        }

        // به‌روزرسانی فیلدهای مجاز
        const allowedFields = [
            'title',
            'price',
            'description',
            'category',
            'image',
            'stock',
            'discount',
            'brand',
            'tags'
        ];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                product[field] = data[field];
            }
        }

        await product.save();

        return NextResponse.json(
            {
                message: 'محصول با موفقیت به‌روزرسانی شد',
                product: product
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('❌ خطا در به‌روزرسانی محصول:', error);
        return NextResponse.json(
            {
                error: 'خطا در به‌روزرسانی محصول',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// ==============================
// GET: دریافت یک محصول
// ==============================
export async function GET(req, { params }) {
    try {
        await connectedToDatabase();
        const { slug } = await params;

        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { error: 'محصول یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);

    } catch (error) {
        console.error('❌ Get error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت محصول' },
            { status: 500 }
        );
    }
}