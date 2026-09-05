// // تبدیل عدد به فرمت تومان با کاما و فارسی
// export function formatPrice(price) {
//     const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
//     const numberWithComma = Number(price).toLocaleString('en-US');
//     return numberWithComma.replace(/\d/g, (digit) => persianDigits[+digit]);
// }

// //   قیمت: {formatPrice(price)} تومان

// // ۱ - ۲ - ۳ - ۴ - ۵ - ۶ - ۷ - ۸ - ۹ - ۱۰




// lib/persian.js

// ==============================
// 1. تبدیل عدد به فرمت تومان با کاما و اعداد فارسی
// ==============================
export function formatPrice(price) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const numberWithComma = Number(price).toLocaleString('en-US');
    return numberWithComma.replace(/\d/g, (digit) => persianDigits[+digit]);
}

// ==============================
// 2. تبدیل اعداد انگلیسی به فارسی (برای شماره تلفن، کد پستی و ...)
// ==============================
export function toPersianDigits(str) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return String(str).replace(/\d/g, (digit) => persianDigits[+digit]);
}

// ==============================
// 3. تبدیل تاریخ به فرمت فارسی
// ==============================
export function formatDate(value) {
    if (!value) return '—';
    try {
        const d = new Date(value);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(d);
    } catch {
        return '—';
    }
}

// ==============================
// 4. تبدیل تاریخ و زمان به فرمت فارسی
// ==============================
export function formatDateTime(value) {
    if (!value) return '—';
    try {
        const d = new Date(value);
        return new Intl.DateTimeFormat('fa-IR', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(d);
    } catch {
        return '—';
    }
}

// ==============================
// 5. گرفتن حروف اول اسم (برای آواتار)
// ==============================
// initials
export function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 1)
        .join('') || '؟';
}