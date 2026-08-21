'use client';

// یک ردیف کامل سفارش (با جزئیات بازشونده)

import { useState, useEffect, useRef } from 'react';
import { formatDate, formatDateTime, formatPrice, initials, toPersianDigits } from '@/lib/persian';
import StatusDropdown from './StatusDropdown';
import InfoRow from './InfoRow';

function finalPrice(item) {
    const base = item.price || 0;
    const discount = item.discount || 0;
    return Math.round(base - (base * discount) / 100);
}

export default function FragmentRow({ order, isOpen, badge, itemCount, onToggle, onStatusChange, onDelete }) {
    const user = order.user || {};
    const [showActions, setShowActions] = useState(false);
    const actionRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionRef.current && !actionRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <tr
                onClick={onToggle}
                className="cursor-pointer border-b border-gray-100/50 transition-colors hover:bg-gray-50/60"
            >
                <td className="px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[12px] font-bold text-indigo-700">
                            {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-medium text-gray-800">{user.name || '—'}</p>
                            <p className="truncate text-[11.5px] text-gray-400">{user.email || '—'}</p>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3.5 text-[13px] text-gray-600">
                    {toPersianDigits(itemCount)} کالا
                </td>
                <td className="px-4 py-3.5 font-semibold text-[13.5px] text-gray-800 font-[var(--font-num)]">
                    {toPersianDigits(formatPrice(order.totalPrice || 0))} تومان
                </td>
                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                        <StatusDropdown
                            currentStatus={order.status}
                            orderId={order._id}
                            onStatusChange={onStatusChange}
                        />

                        <div className="relative" ref={actionRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActions(!showActions);
                                }}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                </svg>
                            </button>

                            {showActions && (
                                <div className="absolute left-0 mt-1 min-w-[180px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-20">

                                    <div className="border-t border-gray-100 my-1" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(order._id);
                                            setShowActions(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-[12.5px] text-rose-600 transition-colors hover:bg-rose-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        حذف سفارش
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3.5 text-[12.5px] text-gray-500">
                    {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3.5 text-left">
                    <svg className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </td>
            </tr>
            {isOpen && (
                <tr className="border-b border-gray-100/50 bg-gray-50/40">
                    <td colSpan={6} className="px-4 py-5 sm:px-5">
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-gray-400">اطلاعات مشتری</p>
                                <div className="space-y-2.5 rounded-xl border border-gray-100 bg-white p-4 text-[13px]">
                                    <InfoRow label="نام" value={user.name} />
                                    <InfoRow label="ایمیل" value={user.email} />
                                    <InfoRow label="شهر" value={`${user.city || '—'}، ${user.country || '—'}`} />
                                    <InfoRow label="آدرس" value={user.address} />
                                    <InfoRow label="کد پستی" value={user.postalCode} num />
                                    <InfoRow label="تلفن" value={user.phone} num />
                                    <InfoRow label="تاریخ ثبت" value={formatDateTime(order.createdAt)} />
                                    <InfoRow label="آخرین بروزرسانی" value={formatDateTime(order.updatedAt)} />
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-gray-400">اقلام سفارش</p>
                                <div className="space-y-2.5">
                                    {(order.cart || []).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 ring-1 ring-gray-100">
                                                {item.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[13px] font-medium text-gray-800">{item.title}</p>
                                                <p className="text-[11.5px] text-gray-400">
                                                    {toPersianDigits(item.quantity)} عدد
                                                    {item.discount > 0 && (
                                                        <span className="mr-2 inline-flex items-center rounded bg-rose-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-rose-600">
                                                            ٪{toPersianDigits(item.discount)} تخفیف
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[13px] font-semibold text-gray-800 font-[var(--font-num)]">
                                                    {toPersianDigits(formatPrice(finalPrice(item) * item.quantity))} تومان
                                                </p>
                                                {item.discount > 0 && (
                                                    <p className="text-[11px] text-gray-400 line-through font-[var(--font-num)]">
                                                        {toPersianDigits(formatPrice((item.price || 0) * item.quantity))}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50/70 px-4 py-3">
                                    <span className="text-[13px] font-medium text-gray-600">جمع کل سفارش</span>
                                    <span className="text-[15px] font-bold text-indigo-700 font-[var(--font-num)]">
                                        {toPersianDigits(formatPrice(order.totalPrice || 0))} تومان
                                    </span>
                                </div>
                                <p className="mt-2 text-[11.5px] text-gray-400">
                                    شناسه سفارش: {String(order._id)}
                                </p>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}