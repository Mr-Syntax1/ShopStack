import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // حذف توکن از کوکی
        cookieStore.delete('token');

        return NextResponse.json({
            success: true,
            message: 'با موفقیت خارج شدید'
        });

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'خطا در خروج' },
            { status: 500 }
        );
    }
}