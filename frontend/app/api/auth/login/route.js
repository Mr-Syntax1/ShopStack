import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken, generateAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        await connectedToDatabase();

        const { email, phone, password } = await req.json();

        // ==============================
        // پشتیبانی از هر دو روش ارسال
        // ==============================
        let loginIdentifier = email || phone;

        if (!loginIdentifier || !password) {
            return NextResponse.json(
                { error: 'ایمیل/شماره موبایل و رمز عبور الزامی هستند' },
                { status: 400 }
            );
        }

        // ==============================
        // پیدا کردن کاربر با ایمیل یا شماره موبایل در دیتابیس
        // ==============================
        const user = await User.findOne({
            $or: [
                { email: loginIdentifier.toLowerCase() },
                { phone: loginIdentifier }
            ]
        });

        if (!user) {
            return NextResponse.json(
                { error: 'ایمیل/شماره موبایل یا رمز عبور اشتباه است' },
                { status: 401 }
            );
        }

        // ==============================
        // بررسی رمز عبور
        // ==============================
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'ایمیل/شماره موبایل یا رمز عبور اشتباه است' },
                { status: 401 }
            );
        }

        // ==============================
        // بررسی اگر ادمین است - ریدایرکت به پنل مدیریت با SSO
        // ==============================
        if (user.role === 'admin') {
            const adminToken = generateAdminToken(user._id, user.email);
            const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL + '/api/auth/sso';
            return NextResponse.json({
                success: true,
                redirectTo: `${adminUrl}?token=${adminToken}`,
                message: 'ادمین هستید، به پنل مدیریت هدایت می‌شوید'
            });
        }

        // ==============================
        // ساخت Token (فقط برای کاربران عادی)
        // ==============================
        const token = generateToken(user._id, user.email, user.role);

        // ==============================
        // ذخیره Token در Cookie
        // ==============================
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 روز
            path: '/',
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'خطا در ورود' },
            { status: 500 }
        );
    }
}