'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toPersianDigits } from '@/lib/persian';
import OrderSkeleton from './OrderSkeleton';
import FragmentRow from './FragmentRow';
import { STATUS } from '@/lib/statusData';
import StatsGrid from './StatCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_KEYS = Object.keys(STATUS);

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [page, setPage] = useState(1);

    const pageSize = 8;

    const fetchOrders = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/orders`, { cache: 'no-store' });
            if (!res.ok) throw new Error(res.status === 500 ? 'خطای سرور (۵۰۰)' : `خطا: ${res.status}`);
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'خطا در دریافت سفارشات');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateOrderStatus = useCallback(async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('خطا در بروزرسانی وضعیت');

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('خطا در تغییر وضعیت سفارش');
        }
    }, []);

    const deleteOrder = useCallback(async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('خطا در حذف سفارش');

            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            if (expandedId === orderId) setExpandedId(null);

        } catch (err) {
            console.error('Error deleting order:', err);
            alert('خطا در حذف سفارش');
        }
    }, [expandedId]);

    // همگام‌سازی دستی وضعیت پرداخت با بلوپال (وقتی وبهوک نرسیده باشد)
    const syncPayment = useCallback(async (orderId) => {
        try {
            const res = await fetch(`${API_URL}/api/payments/sync/${orderId}`, {
                method: 'POST',
            });
            const data = await res.json();

            if (res.ok) {
                fetchOrders(); // بروزرسانی لیست سفارشات با وضعیت تازه
            } else {
                alert(data.error || 'خطا در بروزرسانی وضعیت پرداخت');
            }
        } catch (err) {
            console.error('Error syncing payment:', err);
            alert('خطا در ارتباط با سرور');
        }
    }, [fetchOrders]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return orders.filter((o) => {
            const matchStatus = statusFilter === 'all' || o.status === statusFilter;
            const matchSearch =
                !q ||
                o.user?.name?.toLowerCase().includes(q) ||
                o.user?.email?.toLowerCase().includes(q) ||
                String(o._id || '').toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [orders, statusFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

    return (
        <div className="p-4 md:p-6 lg:p-8 mt-6 lg:mt-0">
            {/* هدر */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-800">سفارشات</h1>
                            <p className="mt-0.5 text-[12.5px] text-gray-500">مدیریت و پیگیری سفارش‌های فروشگاه</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200/80 transition-colors hover:bg-gray-100 cursor-pointer"
                >
                    <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    به‌روزرسانی
                </button>
            </div>

            {/* آمار */}
            <StatsGrid orders={orders} loading={loading} />


            {/* خطا */}
            {error && (
                <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">خطا در دریافت سفارشات</p>
                    <p className="mt-1 text-[13px] text-gray-500">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        تلاش مجدد
                    </button>
                </div>
            )}

            {/* جدول سفارشات */}
            {!error && (
                <div className="rounded-2xl border border-gray-100/80 bg-white/80 shadow-sm backdrop-blur-sm">
                    {/* فیلترها */}
                    <div className="flex flex-col gap-3 border-b border-gray-100/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="جستجوی نام، ایمیل یا شناسه سفارش..."
                                className="w-full rounded-xl border border-gray-200/80 bg-white py-2.5 pr-9 pl-3 text-[13px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                همه
                            </button>
                            {STATUS_KEYS.map((key) => (
                                <button
                                    key={key}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setStatusFilter(key);
                                        setPage(1);
                                    }}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${statusFilter === key ? `${STATUS[key].classes}` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS[key].dot}`} />
                                    {STATUS[key].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* اسکلت / خالی */}
                    {loading && <OrderSkeleton />}

                    {!loading && pageItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-600">سفارشی یافت نشد</p>
                            <p className="text-[12.5px] text-gray-400">فیلترها را تغییر دهید یا صفحه را به‌روزرسانی کنید.</p>
                        </div>
                    )}

                    {/* جدول */}
                    {!loading && pageItems.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] border-collapse text-right">
                                <thead>
                                    <tr className="border-b border-gray-100/70 text-right">
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 sm:px-5">مشتری</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400">اقلام</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400">مبلغ کل</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400">وضعیت</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400">تاریخ</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageItems.map((order) => {
                                        const isOpen = expandedId === order._id;
                                        const badge = STATUS[order.status] || STATUS.pending;
                                        const itemCount = (order.cart || []).reduce((s, i) => s + (i.quantity || 0), 0);
                                        return (
                                            <FragmentRow
                                                key={order._id}
                                                order={order}
                                                isOpen={isOpen}
                                                badge={badge}
                                                itemCount={itemCount}
                                                onToggle={() => toggleExpand(order._id)}
                                                onStatusChange={updateOrderStatus}
                                                onDelete={deleteOrder}
                                                onPaymentSync={syncPayment}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* صفحه‌بندی */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between gap-3 border-t border-gray-100/70 px-4 py-3 sm:px-5">
                            <p className="text-[12.5px] text-gray-500">
                                نمایش {toPersianDigits((safePage - 1) * pageSize + 1)} تا {toPersianDigits(Math.min(safePage * pageSize, filtered.length))} از {toPersianDigits(filtered.length)}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 ring-1 ring-gray-200/80 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>

                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-semibold transition-colors ${safePage === i + 1 ? 'bg-indigo-600 text-white' : 'text-gray-600 ring-1 ring-gray-200/80 hover:bg-gray-50'}`}
                                    >
                                        {toPersianDigits(i + 1)}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safePage === totalPages}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 ring-1 ring-gray-200/80 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}