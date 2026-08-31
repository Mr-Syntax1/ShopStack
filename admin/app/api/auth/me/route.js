import { NextResponse } from 'next/server';
import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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