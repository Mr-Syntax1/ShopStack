// app/api/products/route.js
import { connectedToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectedToDatabase();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const sort = searchParams.get('sort') || 'newest';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // ساخت فیلتر
        const filter = {};
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ];
        }

        // ساخت مرتب‌سازی
        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { updatedAt: -1 };
                break;
            case 'price-asc':
                sortOption = { price: 1 };
                break;
            case 'price-desc':
                sortOption = { price: -1 };
                break;
            case 'stock-asc':
                sortOption = { stock: 1 };
                break;
            case 'stock-desc':
                sortOption = { stock: -1 };
                break;
            case 'popular':
                sortOption = { reviews: -1 };
                break;
            case 'rating':
                sortOption = { rating: -1 };
                break;
            default:
                sortOption = { updatedAt: -1 };
        }

        // دریافت محصولات با populate اگر نیاز باشد
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        // تعداد کل
        const total = await Product.countDocuments(filter);

        return NextResponse.json({
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت محصولات' },
            { status: 500 }
        );
    }
}


// app/api/products/route.js
export async function POST(req) {
    try {
        await connectedToDatabase();
        const data = await req.json();

        console.log('📦 Data received:', data); // لاگ کامل داده

        // بررسی فیلدهای ضروری
        const requiredFields = ['title', 'price', 'description', 'category', 'image', 'brand', 'stock'];
        const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);

        if (missingFields.length > 0) {
            console.log('❌ Missing fields:', missingFields);
            return NextResponse.json(
                {
                    error: 'فیلدهای ضروری پر نشده‌اند',
                    missingFields
                },
                { status: 400 }
            );
        }

        // اگر id در مدل هست و باید ارسال بشه
        if (!data.id && data.id !== 0) {
            // می‌تونید خودکار id بسازید یا خطا بدید
            // راه حل: خودکار id بسازید (آخرین id + 1)
            const lastProduct = await Product.findOne().sort({ id: -1 });
            data.id = lastProduct ? lastProduct.id + 1 : 1;
        }

        const newProduct = new Product(data);
        await newProduct.save();

        return NextResponse.json(
            {
                message: 'محصول با موفقیت اضافه شد',
                product: newProduct
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('❌ Error details:', error); // لاگ کامل خطا
        console.error('❌ Error stack:', error.stack);

        // خطای تکراری بودن
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'این محصول قبلاً ثبت شده است' },
                { status: 400 }
            );
        }

        // خطای اعتبارسنجی
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                {
                    error: 'خطا در اعتبارسنجی',
                    details: errors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: 'خطا در ایجاد محصول',
                message: error.message
            },
            { status: 500 }
        );
    }
}