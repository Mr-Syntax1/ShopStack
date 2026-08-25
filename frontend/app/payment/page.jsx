// app/payment/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toPersianDigits, formatPrice } from '@/lib/persian';

// ==============================
// آیکون‌ها
// ==============================
const StatusIcon = ({ status }) => {
    const icons = {
        SUCCESS: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
        ),
        PENDING: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
        ),
        ERROR: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
        ),
        CANCELED: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
            </svg>
        ),
        EXPIRED: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
        ),
        NO_INVOICE: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        TIMEOUT: () => (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
        ),
    };

    const Icon = icons[status] || icons.ERROR;
    return <Icon />;
};

// ==============================
// وضعیت‌های نهایی
// ==============================
const FINAL_STATES = ['PAID', 'EXPIRED', 'CANCELED', 'ERROR', 'TIMEOUT', 'NO_INVOICE'];

// ==============================
// کامپوننت اصلی
// ==============================
export default function PaymentCallbackPage() {
    const searchParams = useSearchParams();
    const invoiceId = searchParams?.get('invoice_id') ?? null;

    const [isClient, setIsClient] = useState(false);
    const [status, setStatus] = useState('CHECKING');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const pollingRef = useRef(null);
    // برای نگهداری شناسه setInterval تا بتونیم تایمر رو متوقف کنیم
    const attemptsRef = useRef(0);
    // تعداد دفعاتی که از سرور پرسیدیم
    const MAX_ATTEMPTS = 20;
    // حداکثر تعداد دفعات


    // ==============================
    // تابع کمکی برای ذخیره در sessionStorage
    // ==============================
    const saveToCache = (status, data, error) => {
        if (!isClient || !invoiceId || status === 'CHECKING') return;
        try {
            sessionStorage.setItem(`payment_${invoiceId}`, JSON.stringify({
                status,
                data,
                error,
                attempts: attemptsRef.current,
            }));
        } catch (e) { /* ignore */ }
    };

    // ==============================
    // بارگذاری از کش
    // ==============================
    useEffect(() => {
        setIsClient(true);

        if (!invoiceId) {
            setStatus('NO_INVOICE');
            setLoading(false);
            return;
        }

        try {
            const raw = sessionStorage.getItem(`payment_${invoiceId}`);
            if (raw) {
                const cache = JSON.parse(raw);
                if (cache && FINAL_STATES.includes(cache.status)) {
                    setStatus(cache.status);
                    setData(cache.data || null);
                    setError(cache.error || null);
                    setLoading(false);
                }
                attemptsRef.current = cache?.attempts || 0;
            }
        } catch (e) { /* ignore */ }
    }, [invoiceId]);

    // ==============================
    // ذخیره خودکار در کش
    // ==============================
    useEffect(() => {
        saveToCache(status, data, error);
    }, [status, data, error]);

    // ==============================
    // تابع دریافت وضعیت از سرور
    // ==============================
    const fetchStatus = async () => {
        try {
            const res = await fetch(`/api/payments/${invoiceId}`);
            const json = await res.json();

            if (!res.ok) {
                setError(json.error || 'خطا در دریافت وضعیت');
                setStatus('ERROR');
                setLoading(false);
                stopPolling();
                return;
            }

            setData(json);
            setStatus(json.status);
            setLoading(false);

            if (['PAID', 'EXPIRED', 'CANCELED'].includes(json.status)) {
                stopPolling();
                return;
                // اگه پرداخت موفق شد، یا منقضی شد، یا لغو شد، دیگه چک نکن
            }

            if (json.status === 'PENDING') {
                attemptsRef.current += 1;
                if (attemptsRef.current >= MAX_ATTEMPTS) {
                    stopPolling();
                    setStatus('TIMEOUT');
                    setLoading(false);
                }
            }
        } catch (err) {
            console.error('Polling error:', err);
            setError('خطا در ارتباط با سرور');
            setStatus('ERROR');
            setLoading(false);
            stopPolling();
        }
    };

    // متوقف کردن setInterval
    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    // ==============================
    // راه‌اندازی polling
    // ==============================
    useEffect(() => {
        if (!isClient || !invoiceId || FINAL_STATES.includes(status)) {
            stopPolling();
            return;
        }

        fetchStatus();// اولین بار زود وصل شو و صبر نکن
        pollingRef.current = setInterval(fetchStatus, 3000);

        return stopPolling;
    }, [isClient, invoiceId, status]);

    // ==============================
    // رندر لودینگ اولیه
    // ==============================
    if (!isClient || (loading && status === 'CHECKING')) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-gray-200" />
                    <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                </div>
                <p className="text-sm text-gray-400">در حال بررسی وضعیت پرداخت</p>
            </div>
        );
    }

    // ==============================
    // تعیین وضعیت نمایش
    // ==============================
    const getStatusConfig = () => {
        const configs = {
            NO_INVOICE: {
                icon: 'NO_INVOICE',
                title: 'شناسه فاکتور یافت نشد',
                desc: 'لینک پرداخت نامعتبر است یا منقضی شده',
                color: 'gray',
                action: 'shop',
            },
            ERROR: {
                icon: 'ERROR',
                title: 'خطا در بررسی وضعیت',
                desc: error || 'مشکلی پیش آمده است',
                color: 'rose',
                action: 'retry',
            },
            TIMEOUT: {
                icon: 'TIMEOUT',
                title: 'زمان انتظار به پایان رسید',
                desc: 'پرداخت بیشتر از حد انتظار طول کشید. لطفاً وضعیت را بعداً بررسی کنید.',
                color: 'gray',
                action: 'retry_or_shop',
            },
            PAID: {
                icon: 'SUCCESS',
                title: 'پرداخت موفق',
                desc: 'تراکنش شما با موفقیت انجام شد',
                color: 'emerald',
                action: 'shop',
            },
            PENDING: {
                icon: 'PENDING',
                title: 'در انتظار تأیید',
                desc: 'پرداخت در حال بررسی است',
                color: 'amber',
                action: 'shop',
            },
            EXPIRED: {
                icon: 'EXPIRED',
                title: 'فاکتور منقضی شد',
                desc: 'زمان پرداخت به پایان رسیده است',
                color: 'gray',
                action: 'shop',
            },
            CANCELED: {
                icon: 'CANCELED',
                title: 'پرداخت لغو شد',
                desc: 'شما پرداخت را لغو کردید',
                color: 'gray',
                action: 'shop',
            },
        };

        return configs[status] || configs.ERROR;
    };

    const config = getStatusConfig();
    const isPaid = status === 'PAID';
    const isPending = status === 'PENDING';

    // ==============================
    // رندر اصلی
    // ==============================
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-8 mt-20">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">

                {/* هدر */}
                <div className={`px-6 py-4 bg-${config.color}-500 bg-linear-to-r from-${config.color}-500 to-${config.color}-600`}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/80 uppercase tracking-wider">وضعیت پرداخت</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white">
                            {status === 'PAID' ? 'تکمیل شده' :
                                status === 'PENDING' ? 'در انتظار' :
                                    status === 'EXPIRED' ? 'منقضی' :
                                        status === 'CANCELED' ? 'لغو' :
                                            status === 'ERROR' ? 'خطا' :
                                                status === 'TIMEOUT' ? 'زمان‌آپ' :
                                                    status === 'NO_INVOICE' ? 'نامعتبر' : ''}
                        </span>
                    </div>
                </div>

                {/* محتوا */}
                <div className="p-8 text-center">
                    {/* آیکون */}
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-${config.color}-50 text-${config.color}-500`}>
                        <StatusIcon status={config.icon} />
                    </div>

                    {/* عنوان */}
                    <h3 className={`mt-4 text-xl font-bold text-${config.color}-600`}>
                        {config.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                        {config.desc}
                    </p>

                    {/* مبلغ */}
                    {data && (
                        <div className="mt-6 pt-6 border-t border-gray-100/80">
                            <p className="text-xs text-gray-400">مبلغ پرداختی</p>
                            <p className="mt-0.5 text-2xl font-bold text-gray-800">
                                {toPersianDigits(formatPrice(Math.round((data?.finalAmount || data?.amount || 0) / 10)))}
                                <span className="mr-1 text-sm font-normal text-gray-400">تومان</span>
                            </p>
                        </div>
                    )}

                    {/* شناسه فاکتور */}
                    {data && (
                        <p className="mt-3 text-[11px] text-gray-300">
                            شناسه فاکتور: {toPersianDigits(data.invoiceId)}
                        </p>
                    )}

                    {/* اطلاعات پرداخت‌کننده */}
                    {isPaid && data?.payer?.name && (
                        <div className="mt-5 p-4 bg-gray-50/80 rounded-xl text-right text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">پرداخت‌کننده</span>
                                <span className="font-medium text-gray-700">{data.payer.name}</span>
                            </div>
                            {data.payer.bankName && (
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-gray-400">بانک</span>
                                    <span className="font-medium text-gray-700">{data.payer.bankName}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* دکمه‌ها */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/products"
                            className="flex-1 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            بازگشت به فروشگاه
                        </Link>

                        {isPending && data?.paymentLink && (
                            <a
                                href={data.paymentLink}
                                className="flex-1 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all duration-200"
                            >
                                ادامه پرداخت
                            </a>
                        )}

                        {(status === 'ERROR' || status === 'TIMEOUT') && (
                            <button
                                onClick={() => {
                                    if (invoiceId && typeof window !== 'undefined') {
                                        sessionStorage.removeItem(`payment_${invoiceId}`);
                                    }
                                    window.location.reload();
                                }}
                                className="flex-1 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer"
                            >
                                {status === 'ERROR' ? 'تلاش مجدد' : 'بررسی دوباره'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}