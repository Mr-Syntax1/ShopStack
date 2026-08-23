// =============================================================
// کتابخانه ارتباط با API پرداخت بلوپال (نسخه پنل ادمین)
// -------------------------------------------------------------
// فقط سمت سرور اجرا می‌شود. برای همگام‌سازی دستی وضعیت پرداخت
// با بلوپال استفاده می‌شود (مثلاً وقتی وبهوک به هر دلیل نرسیده باشد).
// =============================================================

const BLU_BASE_URL = process.env.BLU_BASE_URL || 'https://blupal.net/api';
const BLU_API_KEY = process.env.BLU_API_KEY;

export function getBlupalMode() {
    if (!BLU_API_KEY) return null;
    return BLU_API_KEY.startsWith('blu_test_') ? 'sandbox' : 'live';
}

// تبدیل تومان به ریال (واحد بلوپال)
export function tomanToRial(toman) {
    return Math.round(Number(toman) * 10);
}

function authHeaders() {
    if (!BLU_API_KEY) {
        throw new Error('BLU_API_KEY تنظیم نشده است.');
    }
    return {
        'Content-Type': 'application/json',
        'X-API-Key': BLU_API_KEY,
    };
}

async function parseBlupalResponse(res) {
    let data = null;
    try { data = await res.json(); } catch { data = null; }

    if (!res.ok || (data && data.success === false)) {
        const message = data?.message || data?.error || `خطای بلوپال (HTTP ${res.status})`;
        const err = new Error(message);
        err.code = data?.error || `http_${res.status}`;
        throw err;
    }
    return data;
}

// بررسی وضعیت فاکتور از بلوپال
// GET /v1/invoices/{invoice_id}
export async function getInvoice(invoiceId) {
    const res = await fetch(`${BLU_BASE_URL}/v1/invoices/${invoiceId}`, {
        method: 'GET',
        headers: authHeaders(),
        cache: 'no-store',
    });
    return parseBlupalResponse(res);
}
