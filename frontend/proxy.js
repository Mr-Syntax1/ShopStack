// proxy.js - Middleware برای فروشگاه
import { NextResponse } from 'next/server';
import { getUserFromToken } from './lib/auth';
import { connectedToDatabase } from './lib/mongodb';

export async function proxy(request) {

    await connectedToDatabase();

    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    // ==============================
    // 1. مسیرهای عمومی (بدون احراز هویت)
    // ==============================
    const publicPaths = ['/', '/products', '/auth/login', '/auth/register', '/contact', '/about', '/cart'];
    const publicApis = ['/api/products', '/api/categories', '/api/dashboard'];
    const authPublicApis = ['/api/auth/login', '/api/auth/register', '/api/auth/logout', '/api/auth/check-unique'];

    const isPublicPath = publicPaths.some(p => pathname === p || pathname.startsWith(`${p}/`));
    const isPublicApi = publicApis.some(p => pathname === p || pathname.startsWith(`${p}/`));
    const isAuthApi = authPublicApis.some(p => pathname === p);
    const isFullyPublic = isPublicPath || isPublicApi || isAuthApi;
    const isApiRoute = pathname.startsWith('/api/');
    // اگه API بود → JSON ریدایرکت کن → اگه صفحه بود → بده

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

            //  برای APIها → 401 JSON برگردون (نه ریدایرکت HTML)
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
        '/((?!api/webhook|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};