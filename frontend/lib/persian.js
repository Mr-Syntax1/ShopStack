// تبدیل عدد به فرمت تومان با کاما و فارسی
export function formatPrice(price) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const numberWithComma = Number(price).toLocaleString('en-US');
    return numberWithComma.replace(/\d/g, (digit) => persianDigits[+digit]);
}

export function toPersianDigits(str) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    return String(str).replace(/\d/g, (digit) => persianDigits[+digit]);
}

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

//   قیمت: {formatPrice(price)} تومان

// ۱ - ۲ - ۳ - ۴ - ۵ - ۶ - ۷ - ۸ - ۹ - ۱۰