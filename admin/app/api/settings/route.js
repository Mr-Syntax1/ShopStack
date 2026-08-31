import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';
import { cookies } from 'next/headers';

// ==============================
// دریافت اطلاعات جاری ادمین
// ==============================
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'احراز هویت نشده' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        await connectedToDatabase();
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'کاربر یافت نشد' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در دریافت اطلاعات کاربر' },
            { status: 500 }
        );
    }
}

// ==============================
// بروزرسانی اطلاعات پروفایل ادمین
// ==============================
export async function PATCH(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'احراز هویت نشده' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const { name, email, phone } = await request.json();
        await connectedToDatabase();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'کاربر یافت نشد' },
                { status: 404 }
            );
        }

        // بررسی تکراری نبودن ایمیل
        if (email && email.toLowerCase() !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'این ایمیل قبلاً استفاده شده است' },
                    { status: 400 }
                );
            }
        }

        // بروزرسانی فیلدها
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (phone) user.phone = phone;

        await user.save();

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در بروزرسانی پروفایل', details: error.message },
            { status: 500 }
        );
    }
}

// ==============================
// تغییر رمز عبور
// ==============================
export async function PUT(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'احراز هویت نشده' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const { currentPassword, newPassword } = await request.json();
        await connectedToDatabase();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'رمز عبور فعلی و جدید الزامی هستند' },
                { status: 400 }
            );
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'کاربر یافت نشد' },
                { status: 404 }
            );
        }

        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'رمز عبور فعلی اشتباه است' },
                { status: 400 }
            );
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        return NextResponse.json({ success: true, message: 'رمز عبور با موفقیت تغییر کرد' });
    } catch (error) {
        return NextResponse.json(
            { error: 'خطا در تغییر رمز عبور', details: error.message },
            { status: 500 }
        );
    }
}
