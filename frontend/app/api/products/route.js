// ALL PRODUCTS
import { NextResponse } from "next/server";
import { connectedToDatabase } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET() {
    try {
        await connectedToDatabase();
        const products = await Product.find({});
        //از دیتابیس همه محصولات رو پیدا کن و توی متغیر products ذخیره کن
        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در دریافت محصولات' },
            { status: 500 }
        );
    }
}
