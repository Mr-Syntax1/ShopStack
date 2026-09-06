'use client';

// یک ردیف کامل سفارش (با جزئیات بازشونده)

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatDate, formatDateTime, formatPrice, initials, toPersianDigits } from '@/lib/persian';
import StatusDropdown from './StatusDropdown';
import InfoRow from './InfoRow';
import DeleteButton from '../DeleteButton';

function finalPrice(item) {
    const base = item.price || 0;
    const discount = item.discount || 0;
    return Math.round(base - (base * discount) / 100);
}

// برچسب‌های وضعیت پرداخت بلوپال
const PAYMENT_LABEL = {
    PENDING: 'در انتظار پرداخت',
    PAID: 'پرداخت شده',
    EXPIRED: 'منقضی شده',
    CANCELED: 'لغو شده',
};

// کلاس رنگ‌بندی برچسب وضعیت پرداخت
function paymentBadgeClass(status) {
    switch (status) {
        case 'PAID': return 'bg-green-50 text-green-600';
        case 'PENDING': return 'bg-amber-50 text-amber-600';
        case 'EXPIRED': return 'bg-rose-50 text-rose-600';
        case 'CANCELED': return 'bg-gray-100 text-gray-500';
        default: return 'bg-gray-100 text-gray-500';
    }
}

export default function FragmentRow({ order, isOpen, badge, itemCount, onToggle, onStatusChange, onDelete, onPaymentSync }) {
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
                <td className="px-4 py-3.5 font-semibold text-[13.5px] text-gray-800">
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
                                <div className="absolute flex justify-around items-center mt-1 min-w-[120px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-50">

                                    <div className="border-t border-gray-100 my-1" />

                                    {/* ✅ استفاده از DeleteButton */}
                                    <DeleteButton
                                        slug={order._id}
                                        title={`سفارش #${order._id.toString().slice(-4)}`}
                                        onDelete={() => {
                                            setShowActions(false);
                                            if (onDelete) {
                                                onDelete(order._id);
                                            }
                                        }}
                                        buttonText="حذف سفارش"
                                        deleteUrl={`/api/orders/${order._id}`}
                                        successMessage={`سفارش #${order._id.toString().slice(-4)} با موفقیت حذف شد`}
                                    // isFullPage
                                    />
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
            </tr >
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
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-indigo-50 to-purple-50 ring-1 ring-gray-100 relative">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
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
                                                    <p className="text-[11px] text-gray-400 line-through">
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

                            {/* بخش وضعیت پرداخت بلوپال (در صورت وجود فاکتور) */}
                            {order.payment?.invoiceId && (
                                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
                                    <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-gray-400">وضعیت پرداخت (بلوپال)</p>
                                    <div className="space-y-2.5 text-[13px]">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-gray-400">وضعیت</span>
                                            <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${paymentBadgeClass(order.payment.status)}`}>
                                                {PAYMENT_LABEL[order.payment.status] || order.payment.status || '—'}
                                            </span>
                                        </div>
                                        <InfoRow label="شناسه فاکتور" value={toPersianDigits(order.payment.invoiceId)} num />
                                        <InfoRow label="محیط" value={order.payment.mode === 'live' ? 'واقعی' : order.payment.mode === 'sandbox' ? 'آزمایشی' : '—'} />
                                        {order.payment.payerName && <InfoRow label="پرداخت‌کننده" value={order.payment.payerName} />}
                                        {order.payment.payerBankName && <InfoRow label="بانک" value={order.payment.payerBankName} />}
                                        {order.payment.paidAt && <InfoRow label="زمان پرداخت" value={formatDateTime(order.payment.paidAt)} />}
                                    </div>
                                </div>
                            )}

                        </div>
                    </td>
                </tr>
            )
            }
        </>
    );
}