'use client';

import { useMemo } from 'react';
import { formatPrice, toPersianDigits } from '@/lib/persian';

const ICONS = {
    revenue: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    orders: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    ),
    customers: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    pending: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    delivered: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function StatsGrid({ orders = [], loading = false }) {
    const s = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const totalOrders = orders.length;
        const pending = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
        const delivered = orders.filter((o) => o.status === 'delivered').length;
        const customers = new Set(orders.map((o) => o.user?.email).filter(Boolean)).size;

        return { totalRevenue, totalOrders, pending, delivered, customers };
    }, [orders]);

    if (loading) {
        return StatsGridSkeleton()
    }

    const cards = [
        { label: 'فروش کل', value: `${formatPrice(s.totalRevenue)} تومان`, icon: ICONS.revenue, accent: 'bg-indigo-50 text-indigo-600' },
        { label: 'سفارشات', value: toPersianDigits(s.totalOrders), icon: ICONS.orders, accent: 'bg-blue-50 text-blue-600' },
        { label: 'مشتریان', value: toPersianDigits(s.customers), icon: ICONS.customers, accent: 'bg-emerald-50 text-emerald-600' },
        { label: 'در انتظار', value: toPersianDigits(s.pending), icon: ICONS.pending, accent: 'bg-amber-50 text-amber-600' },
        { label: 'تحویل شده', value: toPersianDigits(s.delivered), icon: ICONS.delivered, accent: 'bg-green-50 text-green-600' },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="rounded-2xl border border-gray-100/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                    <div className="flex items-center gap-2.5">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.accent}`}>
                            {c.icon}
                        </span>
                        <p className="text-[13px] font-medium text-gray-500">{c.label}</p>
                    </div>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-gray-800">{c.value}</p>
                </div>
            ))}
        </div>
    );
}


function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200/80 bg-white/80 p-5 animate-pulse">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gray-200"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="mt-3 h-8 w-32 bg-gray-200 rounded"></div>
                    <div className="mt-3 h-10 w-full bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
}