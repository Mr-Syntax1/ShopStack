import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(
                new URL('/auth/login?error=no_token', req.url)
            );
        }

        // تایید توکن SSO
        const decoded = verifyToken(token);
        if (!decoded || decoded.type !== 'admin_sso') {
            return NextResponse.redirect(
                new URL('/auth/login?error=invalid_token', req.url)
            );
        }

        // اتصال به دیتابیس و پیدا کردن کاربر
        await connectedToDatabase();
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(
                new URL('/auth/login?error=not_admin', req.url)
            );
        }

        // ساخت توکن کامل ادمین (برای جلسه ادمین)
        const adminToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // ست کردن cookie در ادمین و ریدایرکت به داشبورد
        const response = NextResponse.redirect(
            new URL('/dashboard', req.url)
        );
        response.cookies.set('admin_token', adminToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('SSO error:', error);
        return NextResponse.redirect(
            new URL('/auth/login?error=server_error', req.url)
        );
    }
}