import { NextResponse } from "next/server";
import { connectedToDatabase } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET(request) {
    try {
        await connectedToDatabase();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit')) || 0;
        const offset = parseInt(searchParams.get('offset')) || 0;

        let query = {};
        if (category) {
            query.category = category;
        }

        let productsQuery = Product.find(query).lean();

        if (limit > 0) {
            productsQuery = productsQuery.skip(offset).limit(limit);
        }

        const products = await productsQuery;

        let total;
        if (limit > 0) {
            total = await Product.countDocuments(query);
        } else {
            total = products.length;
        }

        const categories = await Product.distinct('category');

        return NextResponse.json({
            products,
            total,
            categories,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در دریافت محصولات' },
            { status: 500 }
        );
    }
}
