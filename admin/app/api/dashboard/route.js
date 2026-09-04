// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { formatDate } from '@/lib/persian';

// ============================================
// ۱. توابع کمکی (Helpers)
// ============================================

// فیلتر کردن سفارشات بر اساس بازه زمانی
function filterOrdersByDate(orders, startDate, endDate) {
    return orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= startDate && d < endDate;
    });
}

// محاسبه مجموع فروش
function calculateTotalSales(orders) {
    return orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
}

// محاسبه درصد تغییرات
function calculateDelta(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

// ============================================
// ۲. توابع محاسبه آمار
// ============================================

function getTimeRanges(range) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const ranges = {
        today: {
            start: today,
            compareStart: new Date(today.getTime() - 24 * 60 * 60 * 1000),
            end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            label: 'امروز',
            days: 1,
        },
        '7days': {
            start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
            compareStart: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
            end: today,
            label: '۷ روز اخیر',
            days: 7,
        },
        '30days': {
            start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
            compareStart: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
            end: today,
            label: '۳۰ روز اخیر',
            days: 30,
        },
    };

    return ranges[range] || ranges['7days'];
}

function calculateStats(orders, users, range) {
    const { start, compareStart, end } = getTimeRanges(range);

    // سفارشات بازه فعلی و قبلی
    const currentOrders = filterOrdersByDate(orders, start, end);
    const previousOrders = filterOrdersByDate(orders, compareStart, start);

    // آمار فروش
    const currentSales = calculateTotalSales(currentOrders);
    const previousSales = calculateTotalSales(previousOrders);

    // آمار سفارشات
    const currentOrderCount = currentOrders.length;
    const previousOrderCount = previousOrders.length;

    // مشتریان جدید
    const newCustomers = users.filter(u => new Date(u.createdAt) >= start && new Date(u.createdAt) < end).length;
    const newCustomersPrev = users.filter(u => {
        const d = new Date(u.createdAt);
        return d >= compareStart && d < start;
    }).length;

    return {
        totalSales: calculateTotalSales(orders),
        totalOrders: orders.length,
        totalUsers: users.length,
        conversionRate: users.length > 0 ? parseFloat(((orders.length / users.length) * 100).toFixed(1)) : 0,
        periodSales: currentSales,
        periodOrders: currentOrderCount,
        newCustomers,
        salesDelta: calculateDelta(currentSales, previousSales),
        ordersDelta: calculateDelta(currentOrderCount, previousOrderCount),
        customersDelta: calculateDelta(newCustomers, newCustomersPrev),
        periodLabel: getTimeRanges(range).label,
        currentOrders,
        previousOrders,
    };
}

// ============================================
// ۳. توابع تولید داده‌های نمودار
// ============================================

function generateRevenueData(orders, range) {
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const { days } = getTimeRanges(range);
    const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

    const data = [];

    if (range === 'today') {
        const dayOrders = orders.filter(o => new Date(o.createdAt) >= today);
        data.push({
            day: today.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
            revenue: calculateTotalSales(dayOrders),
            orders: dayOrders.length,
        });
    } else if (range === '30days') {
        // ۴ هفته
        for (let i = 3; i >= 0; i--) {
            const start = new Date(today.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const end = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            const weekOrders = filterOrdersByDate(orders, start, end);
            data.push({
                day: `هفته ${4 - i}`,
                revenue: calculateTotalSales(weekOrders),
                orders: weekOrders.length,
            });
        }
    } else {
        // ۷ روز
        for (let i = days - 1; i >= 0; i--) {
            const start = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            const dayOrders = filterOrdersByDate(orders, start, end);
            data.push({
                day: persianDays[start.getDay()],
                revenue: calculateTotalSales(dayOrders),
                orders: dayOrders.length,
            });
        }
    }

    return data;
}

function getOrderStatus(orders) {
    const statusMap = {
        delivered: { label: 'تحویل شده', color: '#4f46e5' },
        processing: { label: 'در حال پردازش', color: '#7c74f5' },
        pending: { label: 'در انتظار', color: '#c7c3fb' },
        shipped: { label: 'ارسال شده', color: '#4f46e5' },
        cancelled: { label: 'لغو شده', color: '#eceaf3' },
        returned: { label: 'بازگشت داده شده', color: '#eceaf3' },
    };

    const counts = {};
    orders.forEach(o => {
        const status = o.status || 'pending';
        counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, value]) => ({
        name: statusMap[status]?.label || status,
        value,
        color: statusMap[status]?.color || '#4f46e5',
    }));
}

function getRecentOrders(orders) {
    return orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(o => ({
            id: `#OS-${o._id.toString().slice(-4)}`,
            customer: o.user?.name || 'نامشخص',
            location: `${o.user?.city || ''}, ${o.user?.country || ''}`.trim() || 'نامشخص',
            product: o.cart?.[0]?.title || 'محصول نامشخص',
            amount: o.totalPrice || 0,
            status: o.status === 'delivered' ? 'تحویل شده' :
                o.status === 'processing' ? 'در حال پردازش' :
                    o.status === 'shipped' ? 'ارسال شده' :
                        o.status === 'cancelled' ? 'لغو شده' : 'در انتظار',
            date: formatDate(o.createdAt),
        }));
}

function getTopProducts(orders, totalSales) {
    const productSales = {};

    orders.forEach(o => {
        (o.cart || []).forEach(item => {
            const key = item.productId?.toString() || item.slug || item.title;
            if (!productSales[key]) {
                productSales[key] = { name: item.title, sold: 0, revenue: 0 };
            }
            productSales[key].sold += item.quantity || 1;
            productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
        });
    });

    return Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(p => ({
            name: p.name,
            sold: p.sold,
            revenue: p.revenue,
            share: Math.round((p.revenue / (totalSales || 1)) * 100),
        }));
}

function getLowStock(products) {
    return products
        .filter(p => p.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
        .map(p => ({
            name: p.title,
            size: 'استاندارد',
            left: p.stock,
        }));
}

function getLiveEvents(orders) {
    return orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(o => {
            const minutes = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
            const timeText = minutes === 0 ? 'لحظاتی پیش' : `${minutes} دقیقه پیش`;
            return `سفارش جدید #OS-${o._id.toString().slice(-4)} از ${o.user?.city || 'نامشخص'}، ${o.user?.country || ''} · ${timeText}`;
        });
}

// ============================================
// ۴. تابع اصلی GET
// ============================================

export async function GET(req) {
    try {
        await connectedToDatabase();

        // دریافت همه داده‌ها
        const [orders, users, products] = await Promise.all([
            Order.find({}).lean(),
            User.find({}).select('-password').lean(),
            Product.find({}).lean(),
        ]);

        // دریافت بازه زمانی از query string
        const url = new URL(req.url);
        const range = url.searchParams.get('range') || '7days';

        // محاسبه آمار
        const stats = calculateStats(orders, users, range);

        return NextResponse.json({
            stats: {
                totalSales: stats.totalSales,
                totalOrders: stats.totalOrders,
                newCustomers: stats.newCustomers,
                conversionRate: stats.conversionRate,
                salesDelta: stats.salesDelta,
                ordersDelta: stats.ordersDelta,
                customersDelta: stats.customersDelta,
            },
            greeting: {
                periodSales: stats.periodSales,
                salesDelta: stats.salesDelta,
                periodLabel: stats.periodLabel,
            },
            revenueSeries: generateRevenueData(orders, range),
            orderStatus: getOrderStatus(orders),
            recentOrders: getRecentOrders(orders),
            topProducts: getTopProducts(orders, stats.totalSales),
            lowStock: getLowStock(products),
            liveEvents: getLiveEvents(orders),
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت داده‌های داشبورد' },
            { status: 500 }
        );
    }
}