import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// بررسی حالت فقط خواندنی
function isReadOnlyMode() {
    return process.env.ADMIN_READ_ONLY === 'true';
}

// تغییر نقش کاربر
export async function PUT(request, { params }) {
    try {
        // چک کردن حالت فقط خواندنی
        if (isReadOnlyMode()) {
            return NextResponse.json(
                { error: 'این عملیات در حالت فقط خواندنی امکان‌پذیر نیست' },
                { status: 403 }
            );
        }

        await connectedToDatabase();

        // بررسی ادمین بودن
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
        }

        const { id } = await params;
        const { role } = await request.json();

        // جلوگیری از تغییر نقش خودش
        if (id === decoded.userId) {
            return NextResponse.json(
                { error: 'نمی‌توانید نقش خودتان را تغییر دهید' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'خطا در تغییر نقش' }, { status: 500 });
    }
}

// حذف کاربر
export async function DELETE(request, { params }) {
    try {
        // چک کردن حالت فقط خواندنی
        if (isReadOnlyMode()) {
            return NextResponse.json(
                { error: 'این عملیات در حالت فقط خواندنی امکان‌پذیر نیست' },
                { status: 403 }
            );
        }

        await connectedToDatabase();

        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
        }

        const { id } = await params;

        // جلوگیری از حذف خودش
        if (id === decoded.userId) {
            return NextResponse.json(
                { error: 'نمی‌توانید خودتان را حذف کنید' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'خطا در حذف کاربر' }, { status: 500 });
    }
}