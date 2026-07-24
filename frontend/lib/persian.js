// تبدیل عدد به فرمت تومان با کاما و فارسی
export function formatPrice(price) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const numberWithComma = Number(price).toLocaleString('en-US');
    return numberWithComma.replace(/\d/g, (digit) => persianDigits[+digit]);
}

//   قیمت: {formatPrice(price)} تومان

// ۱ - ۲ - ۳ - ۴ - ۵ - ۶ - ۷ - ۸ - ۹ - ۱۰