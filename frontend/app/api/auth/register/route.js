// ثبت نام
import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        await connectedToDatabase();

        const { name, email, password, phone } = await req.json();

        // اعتبارسنجی
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: 'همه فیلدها الزامی هستند' },
                { status: 400 }
            );
        }

        if (!/^09[0-9]{9}$/.test(phone)) {
            return NextResponse.json(
                { error: 'شماره موبایل باید 11 رقم و با 09 شروع شود' },
                { status: 400 }
            );
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return NextResponse.json({ error: 'این شماره موبایل قبلاً ثبت شده است' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
                { status: 400 }
            );
        }

        // چک کردن تکراری نبودن ایمیل
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'این ایمیل قبلاً ثبت شده است' },
                { status: 400 }
            );
        }

        // هش کردن رمز عبور
        const hashedPassword = await hashPassword(password);

        // ایجاد کاربر
        const user = await User.create({
            name,
            phone,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // ساخت Token  "کارت شناسایی" 
        const token = generateToken(user._id, user.email, user.role);

        // ذخیره Token در Cookie 
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true, // فقط با HTTP ارسال میشه
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 روز
            path: '/',
        });


        // پاسخ (بدون رمز عبور)
        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'خطا در ثبت‌نام' },
            { status: 500 }
        );
    }
}