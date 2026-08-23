// ALL PRODUCTS
import { NextResponse } from "next/server";
import { connectedToDatabase } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET(request) {
    try {
        await connectedToDatabase();

        const { searchParams } = new URL(request.url)

        const category = searchParams.get('category')

        let products

        if (category) {
            products = await Product.find({ category }).lean()
        }

        else {
            products = await Product.find({}).lean()
        }
        //از دیتابیس همه محصولات رو پیدا کن و توی متغیر products ذخیره کن

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در دریافت محصولات' },
            { status: 500 }
        );
    }
}
