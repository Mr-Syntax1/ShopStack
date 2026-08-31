import { connectedToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await connectedToDatabase();

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const phone = searchParams.get('phone');

        const result = {};

        // بررسی ایمیل
        if (email) {
            const userByEmail = await User.findOne({ email: email });
            result.emailExists = !!userByEmail;
        }

        // بررسی شماره موبایل
        if (phone) {
            const userByPhone = await User.findOne({ phone: phone });
            result.phoneExists = !!userByPhone;
        }

        return NextResponse.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error checking uniqueness:', error);
        return NextResponse.json(
            { error: 'خطا در بررسی اطلاعات کاربر' },
            { status: 500 }
        );
    }
}