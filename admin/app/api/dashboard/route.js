// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { formatDate } from '@/lib/persian';

const DAY = 86400000; // تعداد میلی‌ثانیه در یه روز

// ============================================
// ۱. توابع کمکی (Helpers)
// ============================================

// محاسبه درصد تغییرات
function calculateDelta(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

function getTimeRanges(range) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + DAY);

    const ranges = {
        '7days': {
            start: new Date(today.getTime() - 7 * DAY),
            compareStart: new Date(today.getTime() - 14 * DAY),
            end: tomorrow,
            label: '۷ روز اخیر',
            days: 7,
        },
        '30days': {
            start: new Date(today.getTime() - 30 * DAY),
            compareStart: new Date(today.getTime() - 60 * DAY),
            end: tomorrow,
            label: '۳۰ روز اخیر',
            days: 30,
        },
    };

    return ranges[range] || ranges['7days'];
}

// ============================================
// ۲. توابع محاسبه آمار (همگی روی دیتابیس با Aggregation)
// ============================================

// مجموع فروش و تعداد سفارشات در یک بازه (فقط group روی دیتابیس)
async function sumOrdersInRange(start, end) {
    const res = await Order.aggregate([// یعنی مراحلی که مانگو دی بی انجام میده
        { $match: { createdAt: { $gte: start, $lt: end } } },
        {
            $group: {// گروه‌بندی
                _id: null,
                revenue: { $sum: '$totalPrice' },
                count: { $sum: 1 },
            },
        },
    ]);
    return res[0] || { revenue: 0, count: 0 };
}

// درآمد روزانه (با شماره روز نسبت به شروع بازه — بدون وابستگی به timezone)
async function getDailyBuckets(start, end, rangeStartMs) {
    const rows = await Order.aggregate([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        {
            $group: {
                _id: {
                    $floor: {// گرد به پایین یا همون تبدیبل به عدد صحیح کوچک
                        $divide: [ // تقسیم
                            { $subtract: ['$createdAt', new Date(rangeStartMs)] },// تفریق
                            DAY,
                        ],
                    },
                },
                revenue: { $sum: '$totalPrice' },
                orders: { $sum: 1 },
            },
        },
    ]);
    const map = new Map();// برای جست و جوی سریع
    for (const r of rows) map.set(r._id, { revenue: r.revenue, orders: r.orders });
    return map;
}

// سری زمانی نمودار درآمد (۷ روز = روزانه، ۳۰ روز = هفتگی)
function generateRevenueData(dailyBuckets, range, today) {
    const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    const data = [];

    if (range === '30days') {
        const weeks = 4;
        for (let i = weeks - 1; i >= 0; i--) {
            const startIdx = 30 - (i + 1) * 7;
            let revenue = 0;
            let orders = 0;
            for (let d = startIdx; d <= startIdx + 6; d++) {
                const b = dailyBuckets.get(d);
                if (b) {
                    revenue += b.revenue;
                    orders += b.orders;
                }
            }
            data.push({ day: `هفته ${weeks - i}`, revenue, orders });
        }
    } else {
        const days = 7;
        for (let i = days - 1; i >= 0; i--) {
            const idx = days - i;
            const b = dailyBuckets.get(idx) || { revenue: 0, orders: 0 };
            const d = new Date(today.getTime() - i * DAY);
            data.push({ day: persianDays[d.getDay()], revenue: b.revenue, orders: b.orders });
        }
    }

    return data;
}

const STATUS_MAP = {
    delivered: { label: 'تحویل شده', color: '#4f46e5' },
    processing: { label: 'در حال پردازش', color: '#7c74f5' },
    pending: { label: 'در انتظار', color: '#c7c3fb' },
    shipped: { label: 'ارسال شده', color: '#4f46e5' },
    cancelled: { label: 'لغو شده', color: '#eceaf3' },
    returned: { label: 'بازگشت داده شده', color: '#eceaf3' },
};

// تعداد سفارشات بر اساس وضعیت
async function getOrderStatus() {
    const rows = await Order.aggregate([
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
    return rows.map((s) => ({
        name: STATUS_MAP[s._id]?.label || s._id,
        value: s.value,
        color: STATUS_MAP[s._id]?.color || '#4f46e5',
    }));
}

// ۱۰ سفارش آخر (sort + limit روی دیتابیس)
async function getRecentOrders() {
    const rows = await Order.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
            $project: { // انتخاب فیلد
                _id: 1,
                totalPrice: 1,
                status: 1,
                createdAt: 1,
                customer: { $ifNull: ['$user.name', 'نامشخص'] },
                city: { $ifNull: ['$user.city', ''] },
                country: { $ifNull: ['$user.country', ''] },
                product: { $ifNull: [{ $arrayElemAt: ['$cart.title', 0] }, 'محصول نامشخص'] },
                // arrayElemAt = گرفتن عضو آرایه
            },
        },
    ]);// ifNull = مقدار پیشفرض

    return rows.map((o) => {
        const location = [o.city, o.country].filter(Boolean).join('، ') || 'نامشخص';
        const status = o.status === 'delivered' ? 'تحویل شده' :
            o.status === 'processing' ? 'در حال پردازش' :
                o.status === 'shipped' ? 'ارسال شده' :
                    o.status === 'cancelled' ? 'لغو شده' : 'در انتظار';
        return {
            id: `#${o._id.toString().slice(-5)}`,
            customer: o.customer,
            location,
            product: o.product,
            amount: o.totalPrice || 0,
            status,
            date: formatDate(o.createdAt),
        };
    });
}

// محصولات پرفروش + مجموع فروش کل (برای درصد) — فقط محصولاتی که هنوز وجود دارن
async function getTopProducts(limit = 5) {
    const groups = await Order.aggregate([
        { $unwind: '$cart' },// باز کردن ارایه
        {
            $group: {
                _id: '$cart.productId',
                name: { $first: '$cart.title' },
                sold: { $sum: '$cart.quantity' },
                revenue: {
                    $sum: {
                        $multiply: [// ضرب
                            { $ifNull: ['$cart.price', 0] },
                            { $ifNull: ['$cart.quantity', 1] },
                        ],
                    },
                },
            },
        },
        { $sort: { sold: -1, _id: 1 } },
    ]);

    // فقط محصولاتی که واقعاً توی مجموعه Product وجود دارن رو نگه دار
    // (محصولات حذف‌شده دیگه توی لیست پرفروش‌ها نمایش داده نمی‌شن)
    const validIds = groups
        .map(g => g._id)
        .filter(id => id && mongoose.Types.ObjectId.isValid(id));

    const existing = await Product.find({ _id: { $in: validIds } }).lean();
    const existingIds = new Set(existing.map(p => p._id.toString()));

    const filtered = groups
        .filter(g => g._id && existingIds.has(g._id.toString()))
        .slice(0, limit);

    const totalRes = await Order.aggregate([
        { $unwind: '$cart' },
        { $group: { _id: null, total: { $sum: '$cart.quantity' } } },
    ]);
    const totalSold = totalRes[0]?.total || 1;

    return filtered.map((p) => ({
        name: p.name,
        sold: p.sold,
        revenue: p.revenue,
        share: Math.round((p.sold / totalSold) * 100),
        realShare: Math.round((p.sold / totalSold) * 100),
    }));
}

// ۵ محصول کم‌موجود
async function getLowStock() {
    const rows = await Product.aggregate([
        { $match: { stock: { $lt: 10 } } },
        { $sort: { stock: 1 } },
        { $limit: 5 },
        { $project: { title: 1, stock: 1 } },
    ]);
    return rows.map((p) => ({
        name: p.title,
        size: 'استاندارد',
        left: p.stock,
    }));
}

// ۵ رویداد تیکر زنده
async function getLiveEvents() {
    const rows = await Order.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                city: { $ifNull: ['$user.city', 'نامشخص'] },
                country: { $ifNull: ['$user.country', ''] },
            },
        },
    ]);

    const now = Date.now();
    return rows.map((o) => {
        const createdAt = new Date(o.createdAt).getTime();
        const diffMs = now - createdAt;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        let timeText;
        if (diffMinutes < 1) timeText = 'لحظاتی پیش';
        else if (diffMinutes < 60) timeText = `${diffMinutes} دقیقه پیش`;
        else if (diffHours < 24) timeText = `${diffHours} ساعت پیش`;
        else timeText = `${Math.floor(diffHours / 24)} روز پیش`;

        const location = o.country ? `${o.city}، ${o.country}` : o.city;
        return `سفارش جدید #${o._id.toString().slice(-5)} از ${location} · ${timeText}`;
    });
}

// ============================================
// ۳. تابع اصلی GET
// ============================================

export async function GET(req) {
    try {
        await connectedToDatabase();

        // دریافت بازه زمانی از query string
        const url = new URL(req.url);
        const range = url.searchParams.get('range') || '7days';
        const timeRange = getTimeRanges(range);
        const { start, compareStart, end, label } = timeRange;
        const rangeStartMs = start.getTime();
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

        // اجرای تمام کوئری‌ها به صورت موازی (همگی روی دیتابیس، بدون بارگذاری کل دیتا)
        const [
            current,
            previous,
            newCustomers,
            newCustomersPrev,
            totalUsers,
            dailyBuckets,
            orderStatus,
            recentOrders,
            topProducts,
            lowStock,
            liveEvents,
        ] = await Promise.all([
            sumOrdersInRange(start, end),
            sumOrdersInRange(compareStart, start),
            User.countDocuments({ createdAt: { $gte: start, $lt: end } }),
            User.countDocuments({ createdAt: { $gte: compareStart, $lt: start } }),
            User.countDocuments({}),
            getDailyBuckets(start, end, rangeStartMs),
            getOrderStatus(),
            getRecentOrders(),
            getTopProducts(),
            getLowStock(),
            getLiveEvents(),
        ]);

        const currentSales = current.revenue;
        const currentOrderCount = current.count;
        const previousSales = previous.revenue;
        const previousOrderCount = previous.count;

        const conversionRate = totalUsers > 0
            ? parseFloat(((currentOrderCount / totalUsers) * 100).toFixed(1))
            : 0;
        const previousConversionRate = totalUsers > 0
            ? parseFloat(((previousOrderCount / totalUsers) * 100).toFixed(1))
            : 0;

        return NextResponse.json({
            stats: {
                periodSales: currentSales,
                periodOrders: currentOrderCount,
                newCustomers,
                conversionRate,
                periodLabel: label,

                salesDelta: calculateDelta(currentSales, previousSales),
                ordersDelta: calculateDelta(currentOrderCount, previousOrderCount),
                customersDelta: calculateDelta(newCustomers, newCustomersPrev),
                conversionDelta: calculateDelta(conversionRate, previousConversionRate),
            },
            greeting: {
                periodSales: currentSales,
                salesDelta: calculateDelta(currentSales, previousSales),
                periodLabel: label,
            },
            revenueSeries: generateRevenueData(dailyBuckets, range, today),
            // داده نمودار فروش
            orderStatus,
            // تعداد هر وضعیت سفارش
            recentOrders,
            // ۱۰ سفارش آخر
            topProducts,
            // ۵ محصول پرفروش
            lowStock,
            // ۵ محصول کم‌موجود
            liveEvents,
            // ۵ رویداد تیکر زنده
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت داده‌های داشبورد' },
            { status: 500 }
        );
    }
}