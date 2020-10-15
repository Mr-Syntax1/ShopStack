// proxy.js - Middleware برای پنل مدیریت
import { NextResponse } from 'next/server';

const AUTH_ROUTES = ['/auth/login'];

export async function proxy(request) {

    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value;

    const isDashboardRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
    const isMeApi = pathname.startsWith('/api/auth/me');
    const isProtectedApi = isMeApi || pathname.startsWith('/api/users') || pathname.startsWith('/api/products') || pathname.startsWith('/api/orders') || pathname.startsWith('/api/categories') || pathname.startsWith('/api/payments') || pathname.startsWith('/api/settings');
    // اگر در صفحه لاگین است و توکن دارد → به داشبورد بفرست
    if (isAuthRoute && token) {
        try {
            const user = await getUserFromToken(token);
            if (user?.role === 'admin') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch { }
    }

    // اگر مسیر داشبورد است و توکن ندارد → به لاگین بفرست
    if (isDashboardRoute && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // اگر مسیر داشبورد است و توکن دارد → بررسی نقش
    if (isDashboardRoute && token) {
        try {
            const user = await getUserFromToken(token);
            if (!user || user.role !== 'admin') {
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // APIهای محافظت شده
    if (isProtectedApi && !token) {
        return NextResponse.json({ error: 'احراز هویت نشده' }, { status: 401 });
    }

    // ادامه مسیر
    return NextResponse.next();
}


// ==============================
// تابع دریافت اطلاعات کاربر از توکن
// ==============================
async function getUserFromToken(token) {
    try {
        const { verifyToken } = await import('@/lib/auth');
        const decoded = verifyToken(token);

        if (!decoded) return null;

        const { connectedToDatabase } = await import('@/lib/mongodb');
        const User = (await import('@/models/User')).default;

        await connectedToDatabase();
        const user = await User.findById(decoded.userId).select('-password');

        return user;
    } catch (error) {
        console.error('Error getting user from token:', error);
        return null;
    }
}

// ==============================
// تنظیمات Middleware
// ==============================
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/auth/login|api/auth/register).*)',
    ],
};
