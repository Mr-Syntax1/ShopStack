// =============================================================
// کلاینت نمایش وضعیت پرداخت
// -------------------------------------------------------------
// بر اساس orderId وضعیت پرداخت را هر چند ثانیه استعلام می‌کند
// تا زمانی که فاکتور از حالت PENDING خارج شود. در صورت پرداخت
// موفق پیام موفقیت و در غیر این صورت وضعیت فعلی را نمایش می‌دهد.
// (بلوپال پارامتر بازگشت ندارد، پس این صفحه مرجع بررسی وضعیت است)
// =============================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toPersianDigits, formatPrice } from '@/lib/persian';

const STATUS_LABEL = {
    PENDING: 'در انتظار پرداخت',
    PAID: 'پرداخت شده',
    EXPIRED: 'منقضی شده',
    CANCELED: 'لغو شده',
};

export default function PaymentStatusClient({ orderId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/payments/order/${orderId}`, { cache: 'no-store' });
            const json = await res.json();
            if (!res.ok) {
                setError(json.error || 'خطا در دریافت وضعیت');
                return;
            }
            setData(json);
            setError(null);
        } catch (err) {
            setError('خطا در ارتباط با سرور');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    // استعلام اولیه + polling تا زمانی که پرداخت نهایی شود
    useEffect(() => {
        let active = true;
        let timer;

        const poll = async () => {
            await fetchStatus();
            if (!active) return;
            // هر ۴ ثانیه تکرار کن مگر اینکه وضعیت نهایی شده باشد
            timer = setTimeout(poll, 4000);
        };
        poll();

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [fetchStatus]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                <p className="text-sm">در حال بررسی وضعیت پرداخت...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-gray-700">خطا</p>
                <p className="mt-1 text-[13px] text-gray-500">{error}</p>
                <button onClick={fetchStatus} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white">تلاش مجدد</button>
            </div>
        );
    }

    const status = data?.status;
    const isPaid = status === 'PAID';

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isPaid ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {isPaid ? (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
            </div>

            <h1 className="text-lg font-bold text-gray-800">
                {isPaid ? 'پرداخت با موفقیت انجام شد' : STATUS_LABEL[status] || 'وضعیت نامشخص'}
            </h1>

            <p className="mt-1 text-[13px] text-gray-500">
                مبلغ: {toPersianDigits(formatPrice((data?.finalAmount || data?.amount || 0) / 10))} تومان
            </p>

            {isPaid && data.payer?.name && (
                <div className="mt-4 rounded-xl bg-gray-50 p-4 text-right text-[13px] text-gray-600">
                    <p>پرداخت‌کننده: {data.payer.name}</p>
                    {data.payer.bankName && <p>بانک: {data.payer.bankName}</p>}
                    <p>شناسه فاکتور: {toPersianDigits(data.invoiceId)}</p>
                </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/products" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-700">
                    بازگشت به فروشگاه
                </Link>
                {!isPaid && data.paymentLink && (
                    <a href={data.paymentLink} className="rounded-xl bg-white px-5 py-2.5 text-[13px] font-semibold text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-gray-50">
                        ادامه پرداخت
                    </a>
                )}
            </div>
        </div>
    );
}
