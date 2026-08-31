import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        await connectedToDatabase();

        // بررسی ادمین بودن
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
        }

        // دریافت همه کاربران (به جز رمز عبور)
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'خطا در دریافت کاربران' }, { status: 500 });
    }
}