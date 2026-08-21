export const STATUS = {
    pending: {
        label: 'در انتظار',
        dot: 'bg-amber-500',
        classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10'
    },

    processing: {
        label: 'در حال پردازش',
        dot: 'bg-indigo-500',
        classes: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10'
    },

    shipped: {
        label: 'ارسال شده',
        dot: 'bg-blue-500',
        classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10'
    },

    delivered: {
        label: 'تحویل شده',
        dot: 'bg-emerald-500',
        classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
    },

    cancelled: {
        label: 'لغو شده',
        dot: 'bg-rose-500',
        classes: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10'
    },

    returned: {
        label: 'مرجوع شده',
        dot: 'bg-gray-400',
        classes: 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/10'
    },
};