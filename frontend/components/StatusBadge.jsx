'use client';

// نمایش وضعیت‌های سفارش و پرداخت به صورت badges رنگی
const ORDER_STATUS = {
    pending: { label: 'در انتظار', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    shipped: { label: 'ارسال شده', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    delivered: { label: 'تحویل داده شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    returned: { label: 'بازگشت داده شده', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const PAYMENT_STATUS = {
    PENDING: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    PAID: { label: 'پرداخت شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    EXPIRED: { label: 'منقضی شده', color: 'bg-gray-100 text-gray-600 border-gray-200' },
    CANCELED: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function StatusBadge({ type = 'order', status }) {
    const map = type === 'payment' ? PAYMENT_STATUS : ORDER_STATUS;
    const config = map[status] || { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
            {config.label}
        </span>
    );
}

export { ORDER_STATUS, PAYMENT_STATUS };
