// apps/admin/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        await connectedToDatabase();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'ایمیل و رمز عبور الزامی هستند' },
                { status: 400 }
            );
        }

        // پیدا کردن کاربر
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: email }
            ]
        });

        if (!user) {
            return NextResponse.json(
                { error: 'ایمیل یا رمز عبور اشتباه است' },
                { status: 401 }
            );
        }

        // بررسی رمز عبور
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'ایمیل یا رمز عبور اشتباه است' },
                { status: 401 }
            );
        }

        // ساخت Token
        const token = generateToken(user._id, user.email, user.role);

        // ذخیره Token در Cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
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
                balance: user.balance,
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