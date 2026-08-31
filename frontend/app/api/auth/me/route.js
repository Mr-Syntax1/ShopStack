// دریافت و بروزرسانی اطلاعات کاربر فعلی
import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// ==============================
// دریافت اطلاعات کاربر
// ==============================
export async function GET() {
    try {
        // دریافت کوکی token از درخواست
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        // اگر توکن وجود نداشت → خطای 401
        if (!token) {
            return NextResponse.json(
                { error: 'احراز هویت نشده' },
                { status: 401 }
            );
        }

        // اعتبارسنجی توکن
        const decoded = getUserFromToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'احراز هویت نشده' },
                { status: 401 }
            );
        }

        // اتصال به دیتابیس و پیدا کردن کاربر
        await connectedToDatabase();
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'کاربر یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });

    } catch (error) {
        console.error('Me error:', error);
        return NextResponse.json(
            { error: 'خطا در دریافت اطلاعات' },
            { status: 500 }
        );
    }
}

// ==============================
// بروزرسانی اطلاعات کاربر
// ==============================
export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'احراز هویت نشده' }, { status: 401 });
        }

        const decoded = getUserFromToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'توکن نامعتبر' }, { status: 401 });
        }

        // دریافت اطلاعات جدید از درخواست
        const body = await req.json().catch(() => ({}));
        const { name, email } = body;

        if (!name && !email) {
            return NextResponse.json({ error: 'فیلدی برای بروزرسانی ارسال نشده' }, { status: 400 });
        }

        await connectedToDatabase();

        //  ساخت شیء برای بروزرسانی (فقط فیلدهای معتبر)
        const updateFields = {};

        // اعتبارسنجی name , email
        if (name && typeof name === 'string' && name.trim().length >= 2) {
            updateFields.name = name.trim();
        }

        if (email && typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            updateFields.email = email.trim().toLowerCase();
        }

        // اگر هیچ فیلد معتبری نبود → خطای 400
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ error: 'مقادیر ارسال شده معتبر نیست' }, { status: 400 });
        }

        // بروزرسانی در دیتابیس
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password'); // حذف رمز از خروجی

        if (!updatedUser) {
            return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'خطا در بروزرسانی پروفایل', details: error.message },
            { status: 500 }
        );
    }
}