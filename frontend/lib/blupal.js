// =============================================================
// کتابخانه ارتباط با API پرداخت بلوپال (BluePal)
// -------------------------------------------------------------
// نکته امنیتی مهم: این فایل فقط در سمت سرور (Server) اجرا می‌شود
// و کلید API هرگز نباید به کد کلاینت (مرورگر) راه پیدا کند.
// تمام تابع‌ها از متغیرهای محیطی BLU_API_KEY / BLU_BASE_URL استفاده می‌کنند.
// =============================================================

// آدرس پایه API بلوپال - مقدار پیش‌فرض طبق مستندات
const BLU_BASE_URL = process.env.BLU_BASE_URL || 'https://blupal.net/api';

// کلید API (blu_test_... برای محیط Sandbox، blu_live_... برای محیط واقعی)
const BLU_API_KEY = process.env.BLU_API_KEY;

// حداقل مبلغ مجاز در مستندات بلوپال: ۱۰۰,۰۰۰ ریال
const MIN_AMOUNT_RIAL = 100000;

// تشخیص خودکار محیط (Sandbox/Live) از روی پیشوند کلید
// این باعث می‌شود کد جای دیگر نگران تفکیک محیط نباشد.
export function getBlupalMode() {
    if (!BLU_API_KEY) return null;
    return BLU_API_KEY.startsWith('blu_test_') ? 'sandbox' : 'live';
}

// تبدیل تومان (واحد فروشگاه) به ریال (واحد بلوپال)
// مستندات بلوپال مبالغ را به ریال می‌خواهد؛ فروشگاه ما تومان کار می‌کند.
export function tomanToRial(toman) {
    return Math.round(Number(toman) * 10);
}

// هدرهای مشترک برای تمام درخواست‌ها
function authHeaders() {
    if (!BLU_API_KEY) {
        throw new Error('BLU_API_KEY تنظیم نشده است. لطفاً در فایل .env.local مقداردهی کنید.');
    }
    return {
        'Content-Type': 'application/json',
        'X-API-Key': BLU_API_KEY,
    };
}

// پارسر عمومی پاسخ‌های بلوپال - در صورت خطا استثنا می‌دهد
async function parseBlupalResponse(res) {
    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    // اگر پاسخ success:false داشت یا وضعیت HTTP ناموفق بود، خطا بده
    if (!res.ok || (data && data.success === false)) {
        const message = data?.message || data?.error || `خطای بلوپال (HTTP ${res.status})`;
        const err = new Error(message);
        err.code = data?.error || `http_${res.status}`;
        err.status = res.status;
        throw err;
    }
    return data;
}

// =============================================================
// ۱) ایجاد فاکتور پرداخت
//    POST /v1/invoices/create
// -------------------------------------------------------------
// amount: مبلغ به ریال (حداقل 100000)
// cardNumber: اختیاری - در Sandbox نادیده گرفته می‌شود
// پاسخ شامل invoice_id, payment_link, final_amount, status, mode و ... است
// =============================================================
export async function createInvoice({ amount, cardNumber }) {
    const rial = tomanToRial(amount);

    if (!rial || rial < MIN_AMOUNT_RIAL) {
        const err = new Error(`مبلغ باید حداقل ${MIN_AMOUNT_RIAL} ریال (۱۰,۰۰۰ تومان) باشد`);
        err.code = 'amount_too_low';
        throw err;
    }

    const res = await fetch(`${BLU_BASE_URL}/v1/invoices/create`, {
        method: 'POST',
        headers: authHeaders(),
        // کارت فقط در صورت وجود ارسال می‌شود (در Sandbox بی‌اثر است)
        body: JSON.stringify(cardNumber ? { amount: rial, card_number: cardNumber } : { amount: rial }),
        cache: 'no-store',
    });

    return parseBlupalResponse(res);
}

// =============================================================
// ۲) شبیه‌سازی پرداخت (فقط محیط Sandbox - برای تست)
//    POST /v1/sandbox/invoices/{invoice_id}/simulate
// -------------------------------------------------------------
// scenarioهای ممکن: success | wrong_amount | expire | cancel
// فقط با کلید Sandbox و فاکتور در وضعیت PENDING کار می‌کند.
// =============================================================
export async function simulatePayment(invoiceId, scenario = 'success') {
    const res = await fetch(`${BLU_BASE_URL}/v1/sandbox/invoices/${invoiceId}/simulate`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ scenario }),
        cache: 'no-store',
    });

    return parseBlupalResponse(res);
}

// =============================================================
// ۳) بررسی وضعیت فاکتور
//    GET /v1/invoices/{invoice_id}
// -------------------------------------------------------------
// وضعیت‌های برگشتی: PENDING | PAID | EXPIRED | CANCELED
// فیلدهای payer_* فقط پس از پرداخت موفق پر می‌شوند.
// =============================================================
export async function getInvoice(invoiceId) {
    const res = await fetch(`${BLU_BASE_URL}/v1/invoices/${invoiceId}`, {
        method: 'GET',
        headers: authHeaders(),
        cache: 'no-store',
    });

    return parseBlupalResponse(res);
}

export { MIN_AMOUNT_RIAL };
