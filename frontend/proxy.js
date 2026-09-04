// proxy.js - Middleware برای فروشگاه
import { NextResponse } from 'next/server';
import { getUserFromToken } from './lib/auth';

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // ==============================
    // ۱. مسیرهای عمومی (بدون احراز هویت)
    // ==============================
    const publicPaths = ['/', '/products', '/products/*', '/auth/login', '/auth/register', '/contact', '/about', '/cart'];
    const publicApis = ['/api/products', '/api/categories', '/api/dashboard', '/api/products/[slug]', '/api/products/related']; // ← اضافه شد

    const isPublicPath = publicPaths.some(p => pathname === p || pathname.startsWith(`${p}/`));
    const isPublicApi = publicApis.some(p => pathname.startsWith(p));
    const isAuthApi = pathname.startsWith('/api/auth');

    // ==============================
    // ۲. اعتبارسنجی توکن
    // ==============================
    let user = null;
    if (token) {
        try {
            user = getUserFromToken(token);
        } catch (error) {
            console.error('❌ خطا در اعتبارسنجی توکن:', error.message);
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    // ==============================
    // ۳. اگر توکن نامعتبره و مسیر عمومی نیست → پاک کن و به لاگین بفرست
    // ==============================
    if (token && !user && !isPublicPath && !isAuthApi && !isPublicApi) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    // ==============================
    // ۴. اگر کاربر لاگین کرده و میخواد بره صفحات لاگین/ثبت‌نام
    // ==============================
    if (user && (pathname === '/auth/login' || pathname.startsWith('/auth/register'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ==============================
    // ۵. اگر کاربر لاگین نکرده و میخواد به مسیر محافظت شده بره
    // ==============================
    if (!token && !isPublicPath && !isAuthApi && !isPublicApi) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // ==============================
    // ۶. ادامه مسیر
    // ==============================
    return NextResponse.next();
}

// ==============================
// تنظیمات Middleware
// ==============================
export const config = {
    matcher: [
        '/((?!api/webhook|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};