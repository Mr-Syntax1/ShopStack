import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { formatDate } from '@/lib/persian';

export async function GET() {
    try {
        await connectedToDatabase();

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
        const last7Start = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last14Start = new Date(todayStart.getTime() - 14 * 24 * 60 * 60 * 1000);

        const [orders, users, products] = await Promise.all([
            Order.find({}).lean(),
            User.find({}).select('-password').lean(),
            Product.find({}).lean(),
        ]);

        // ==============================
        // آمار کلی
        // ==============================
        const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const totalOrders = orders.length;
        const totalUsers = users.length;
        const conversionRate = totalUsers > 0 ? parseFloat(((totalOrders / totalUsers) * 100).toFixed(1)) : 0;

        // ==============================
        // مقایسه با دیروز و هفته قبل
        // ==============================
        const todaySales = orders
            .filter(o => new Date(o.createdAt) >= todayStart)
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        const yesterdaySales = orders
            .filter(o => {
                const d = new Date(o.createdAt);
                return d >= yesterdayStart && d < todayStart;
            })
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        const salesDelta = yesterdaySales > 0 ? parseFloat((((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(1)) : (todaySales > 0 ? 100 : 0);

        const ordersLast7 = orders.filter(o => new Date(o.createdAt) >= last7Start).length;
        const ordersPrev7 = orders.filter(o => {
            const d = new Date(o.createdAt);
            return d >= last14Start && d < last7Start;
        }).length;
        const ordersDelta = ordersPrev7 > 0 ? parseFloat((((ordersLast7 - ordersPrev7) / ordersPrev7) * 100).toFixed(1)) : (ordersLast7 > 0 ? 100 : 0);

        const newCustomers7d = users.filter(u => new Date(u.createdAt) >= last7Start).length;
        const newCustomersPrev7d = users.filter(u => {
            const d = new Date(u.createdAt);
            return d >= last14Start && d < last7Start;
        }).length;
        const customersDelta = newCustomersPrev7d > 0 ? parseFloat((((newCustomers7d - newCustomersPrev7d) / newCustomersPrev7d) * 100).toFixed(1)) : (newCustomers7d > 0 ? 100 : 0);

        // ==============================
        // درآمد بر اساس روز (۷ روز اخیر)
        // ==============================
        const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
        const revenueByDay = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
            const dayOrders = orders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= dayStart && d < dayEnd;
            });
            const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
            const dayName = persianDays[dayStart.getDay()];
            revenueByDay.push({
                day: dayName,
                revenue: dayRevenue,
                orders: dayOrders.length,
            });
        }

        // ==============================
        // تعداد سفارشات بر اساس وضعیت
        // ==============================
        const statusCounts = {};
        orders.forEach(o => {
            const status = o.status || 'pending';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusColors = {
            delivered: '#4f46e5',
            processing: '#7c74f5',
            pending: '#c7c3fb',
            shipped: '#4f46e5',
            cancelled: '#eceaf3',
            returned: '#eceaf3',
        };

        const statusLabels = {
            delivered: 'تحویل شده',
            processing: 'در حال پردازش',
            pending: 'در انتظار',
            shipped: 'ارسال شده',
            cancelled: 'لغو شده',
            returned: 'بازگشت داده شده',
        };

        const orderStatus = Object.entries(statusCounts).map(([status, value]) => ({
            name: statusLabels[status] || status,
            value,
            color: statusColors[status] || '#4f46e5',
        }));

        // ==============================
        // سفارشات اخیر (۱۰ مورد)
        // ==============================
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
            .map(o => ({
                id: `#OS-${o._id.toString().slice(-4)}`,
                customer: o.user?.name || 'نامشخص',
                location: `${o.user?.city || ''}, ${o.user?.country || ''}`.trim() || 'نامشخص',
                product: o.cart?.[0]?.title || 'محصول نامشخص',
                amount: o.totalPrice || 0,
                status: statusLabels[o.status] || o.status,
                date: formatDate(o.createdAt),
            }));

        // ==============================
        // محصولات برتر بر اساس فروش
        // ==============================
        const productSales = {};
        orders.forEach(o => {
            (o.cart || []).forEach(item => {
                const key = item.productId?.toString() || item.slug || item.title;
                if (!productSales[key]) {
                    productSales[key] = {
                        name: item.title,
                        sold: 0,
                        revenue: 0,
                    };
                }
                productSales[key].sold += item.quantity || 1;
                productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((p, i) => ({
                name: p.name,
                sold: p.sold,
                revenue: p.revenue,
                share: Math.round((p.revenue / (totalSales || 1)) * 100),
            }));

        // ==============================
        // محصولات با موجودی کم
        // ==============================
        const lowStock = products
            .filter(p => p.stock < 10)
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 5)
            .map(p => ({
                name: p.title,
                size: 'استاندارد',
                left: p.stock,
            }));

        // ==============================
        // رویدادهای زنده
        // ==============================
        const liveEvents = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(o => {
                const timeDiff = Date.now() - new Date(o.createdAt).getTime();
                const minutes = Math.floor(timeDiff / 60000);
                let timeText = 'لحظاتی پیش';
                if (minutes > 0) timeText = `${minutes} دقیقه پیش`;

                return `سفارش جدید #OS-${o._id.toString().slice(-4)} از ${o.user?.city || 'نامشخص'}، ${o.user?.country || ''} · ${timeText}`;
            });

        return NextResponse.json({
            stats: {
                totalSales,
                totalOrders,
                newCustomers: newCustomers7d,
                conversionRate,
                salesDelta,
                ordersDelta,
                customersDelta,
            },
            greeting: {
                todaySales,
                salesDelta,
            },
            revenueSeries: revenueByDay,
            orderStatus,
            recentOrders,
            topProducts,
            lowStock,
            liveEvents,
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت داده‌های داشبورد' },
            { status: 500 }
        );
    }
}
