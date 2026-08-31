// middleware.js همان
import { NextResponse } from 'next/server';
import { getUserFromToken } from './lib/auth';

export async function proxy(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // ==============================
    // ۱. مسیرهای عمومی (بدون احراز هویت)
    // ==============================
    const publicPaths = ['/', '/products', '/auth/login', '/auth/register'];
    const isPublicPath = publicPaths.some(p => pathname.startsWith(p));

    // ==============================
    // ۲. مسیرهای API احراز هویت (همیشه عمومی)
    // ==============================
    const isAuthApi = pathname.startsWith('/api/auth');
    if (isAuthApi) {
        return NextResponse.next();
    }

    // ==============================
    // ۳. مسیرهای ادمین
    // ==============================
    const isAdminPath = pathname.startsWith('/admin');

    // ==============================
    // ۴. اعتبارسنجی توکن (با مدیریت خطا)
    // ==============================
    let user = null;
    if (token) {
        try {
            user = getUserFromToken(token);
        } catch (error) {
            console.error('❌ خطا در اعتبارسنجی توکن:', error.message);
            // توکن نامعتبر - پاکش کن
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    // ==============================
    // ۵. اگر کاربر توکن نداره و میخواد به مسیر محافظت شده بره
    // ==============================
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/login', request.url));

    }

    // ==============================
    // ۶. اگر توکن نامعتبره و مسیر عمومی نیست
    // ==============================
    if (token && !user && !isPublicPath) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    // ==============================
    // ۷. اگر کاربر لاگین کرده و میخواد بره صفحات لاگین/ثبت‌نام
    // ==============================
    if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ==============================
    // ۸. اگر کاربر ادمین نیست و میخواد بره ادمین
    // ==============================
    if (isAdminPath) {
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // ==============================
    // ۹. ادامه مسیر
    // ==============================
    return NextResponse.next();
}

// ==============================
// تنظیمات Middleware (بهینه شده)
// ==============================
export const config = {
    matcher: [
        /*
         * مسیرهایی که middleware اجرا میشه:
         * - تمام مسیرهای صفحه (به جز فایل‌های استاتیک)
         * - APIها (به جز webhook)
         */
        '/((?!api/webhook|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};