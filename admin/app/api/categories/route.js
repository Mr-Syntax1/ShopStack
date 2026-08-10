// app/api/categories/route.js
import { connectedToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectedToDatabase();

        // دریافت دسته‌بندی‌های یکتا از محصولات
        const categories = await Product.distinct('category');

        // فیلتر کردن مقادیر خالی
        const result = categories
            .filter(cat => cat && cat.trim() !== '')
            .map(name => ({
                _id: name,
                name: name,
            }));

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت دسته‌بندی‌ها' },
            { status: 500 }
        );
    }
}