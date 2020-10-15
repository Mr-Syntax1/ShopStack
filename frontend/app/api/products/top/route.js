import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(req) {
    await connectedToDatabase();

    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit' || '8'));
    // ۱. تجمیع فروش هر محصول (همه سفارش‌ها، بر اساس تعداد فروخته‌شده)
    const sales = await Order.aggregate([
        { $unwind: '$cart' },// باز کردن و جدا کردن ارایه
        {
            $group: {
                _id: '$cart.productId',// گروه بندی بر اساس ای دی
                sold: { $sum: '$cart.quantity' },// مجموع تعداد فروش
            },
        },
        { $sort: { sold: -1, _id: 1 } },
        { $limit: limit },
    ]);

    if (!sales.length) {
        // اگه فروشی نبود، جدیدترین‌های موجود رو بده
        const fallback = await Product.find({}).sort({ createdAt: -1 }).limit(limit).lean();
        return NextResponse.json({ products: fallback });
    }

    // ۲. فقط idهایی که ObjectId معتبرن رو نگه دار تا خطای CastError نگیریم
    const ids = sales
        .map(s => s._id)
        .filter(id => id && mongoose.Types.ObjectId.isValid(id));

    // ۳. فقط محصولاتی که واقعاً توی مجموعه Product وجود دارن
    const products = await Product.find({ _id: { $in: ids } }).lean();

    let sorted = ids
        .map(id => products.find(p => p._id.toString() === id.toString()))
        .filter(Boolean);

    // ۴. اگه به دلیل حذف چند محصول کمتر از limit داریم، بقیه رو با جدیدترین‌های موجود پر کن
    if (sorted.length < limit) {
        const existingIds = sorted.map(p => p._id.toString());
        const fill = await Product.find({ _id: { $nin: existingIds } })
            // $nin = not in
            .sort({ createdAt: -1, _id: 1 })
            .limit(limit - sorted.length)
            .lean();
        sorted = [...sorted, ...fill];
    }

    return NextResponse.json({ products: sorted });
}