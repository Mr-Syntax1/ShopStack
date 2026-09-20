// proxy.js - Middleware برای فروشگاه
import { NextResponse } from 'next/server';
import { getUserFromToken } from './lib/auth';

// ==============================
// Rate Limiting (In-Memory)
// ==============================
const rateLimitStore = new Map();
// توش ذخیره میکنه که هر IP چند بار درخواست داده

/**
 * بررسی Rate Limit
 *  ip - آی‌پی کاربر
 *  route - مسیر درخواست
 *  limit - حداکثر تعداد درخواست
 *  windowMs - بازه محدودیت (میلی‌ثانیه)
 */

// پاک کردن خودکار ورودی‌های قدیمی (هر ۵ دقیقه)
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, data] of rateLimitStore.entries()) {
            if (now > data.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

function checkRateLimit(ip, route, limit, windowMs) {
    const key = `${route}:${ip}`;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
    }

    const data = rateLimitStore.get(key);

    // اگه بازه تموم شده، ریست کن
    if (now > data.resetTime) {
        data.count = 1;
        data.resetTime = now + windowMs;
        return { allowed: true, remaining: limit - 1, resetTime: data.resetTime };
    }

    // چک کن که از حد رد نشده
    if (data.count >= limit) {
        return { allowed: false, remaining: 0, resetTime: data.resetTime };
    }

    data.count++;
    return { allowed: true, remaining: limit - data.count, resetTime: data.resetTime };
}

// ==============================
// تعریف محدودیت‌ها برای هر مسیر
// ==============================
const RATE_LIMITS = [
    // احراز هویت (حساس‌ترین)
    { path: '/api/auth/login', limit: 5, windowMs: 60 * 1000 },      // ۵ بار در دقیقه
    { path: '/api/auth/register', limit: 3, windowMs: 60 * 1000 },   // ۳ بار در دقیقه
    { path: '/api/auth/check-unique', limit: 10, windowMs: 60 * 1000 }, // ۱۰ بار در دقیقه

    // پرداخت (حساس)
    { path: '/api/payments/create', limit: 5, windowMs: 60 * 1000 }, // ۵ بار در دقیقه

    // APIهای عمومی (معمولی)
    { path: '/api/products', limit: 60, windowMs: 60 * 1000 },       // ۶۰ بار در دقیقه
    { path: '/api/categories', limit: 30, windowMs: 60 * 1000 },     // ۳۰ بار در دقیقه

    // پیش‌فرض برای همه APIها
    { path: '/api/', limit: 100, windowMs: 60 * 1000 },              // ۱۰۰ بار در دقیقه
];

function getRateLimit(pathname) {
    // از خاص به عام بگرد
    for (const rule of RATE_LIMITS) {
        if (pathname === rule.path || pathname.startsWith(rule.path + '/')) {
            return rule;
        }
    }
    return null;
}

// ==============================
// Middleware اصلی
// ==============================
export async function proxy(request) {

    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // ==============================
    // 0. Rate Limiting (قبل از هر چیز!)
    // ==============================
    if (pathname.startsWith('/api/')) {
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || // (پروکسی/CDN)
            request.headers.get('x-real-ip') || // (Nginx)
            'unknown';

        const limitConfig = getRateLimit(pathname);

        if (limitConfig) {
            const { allowed, remaining, resetTime } = checkRateLimit(
                ip,
                limitConfig.path,
                limitConfig.limit,
                limitConfig.windowMs
            );

            if (!allowed) { // (به حد رسیده)
                const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

                return NextResponse.json(
                    {
                        error: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.',
                        retryAfter,
                    },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': String(retryAfter),// زمان باقی‌مونده تا ریست
                            'X-RateLimit-Limit': String(limitConfig.limit),
                            'X-RateLimit-Remaining': '0',
                            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
                        },
                    }
                );
            }
        }
    }

    // ==============================
    // 1. مسیرهای عمومی (بدون احراز هویت)
    // ==============================
    const publicPaths = ['/', '/products', '/auth/login', '/auth/register', '/contact', '/about', '/cart'];
    const publicApis = ['/api/products', '/api/categories', '/api/dashboard', '/api/payments/webhook'];
    const authPublicApis = ['/api/auth/login', '/api/auth/register', '/api/auth/logout', '/api/auth/check-unique'];

    const isPublicPath = publicPaths.some(p => pathname === p || pathname.startsWith(`${p}/`));
    const isPublicApi = publicApis.some(p => pathname === p || pathname.startsWith(`${p}/`));
    const isAuthApi = authPublicApis.some(p => pathname === p);
    const isFullyPublic = isPublicPath || isPublicApi || isAuthApi;
    const isApiRoute = pathname.startsWith('/api/');

    // ==============================
    // 2. اعتبارسنجی توکن
    // ==============================
    let user = null;
    if (token) {
        try {
            user = getUserFromToken(token);
            if (!user) throw new Error('توکن نامعتبر');
        } catch (error) {
            console.error('❌ خطا در اعتبارسنجی توکن:', error.message);

            // برای APIها → 401 JSON
            if (isApiRoute) {
                const response = NextResponse.json(
                    { error: 'توکن نامعتبر یا منقضی شده', user: null },
                    { status: 401 }
                );
                response.cookies.delete('token');
                return response;
            }

            // برای صفحات → ریدایرکت یا ادامه
            const response = isFullyPublic
                ? NextResponse.next()
                : NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    // ==============================
    // 3. اگر کاربر لاگین کرده و میخواد بره صفحات لاگین/ثبت‌نام
    // ==============================
    if (user && (pathname === '/auth/login' || pathname.startsWith('/auth/register'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ==============================
    // 4. اگر کاربر لاگین نکرده و میخواد به مسیر محافظت شده بره
    // ==============================
    if (!token && !isFullyPublic) {
        // برای APIها → 401 JSON
        if (isApiRoute) {
            return NextResponse.json(
                { error: 'احراز هویت نشده', user: null },
                { status: 401 }
            );
        }
        // برای صفحات → ریدایرکت
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // ==============================
    // 5. ادامه مسیر
    // ==============================
    return NextResponse.next();
}

// ==============================
// تنظیمات Middleware
// ==============================
export const config = {
    matcher: [
        '/((?!api/webhook|api/payments/webhook|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
