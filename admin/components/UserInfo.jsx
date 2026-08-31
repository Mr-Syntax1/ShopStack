// components/UserInfo.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AvatarWithOutLink } from './Avatar';

export default function UserInfo() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // ==============================
    // دریافت اطلاعات کاربر از API
    // ==============================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    credentials: 'include',
                });

                if (!res.ok) {
                    router.push('/auth/login');
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // ==============================
    // تابع خروج از حساب
    // ==============================
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('خطا در خروج');
            }

            toast.success('با موفقیت خارج شدید');
            window.location.href = 'http://localhost:3001/auth/login';

        } catch (error) {
            toast.error(error.message || 'خطا در خروج');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // ==============================
    // گرفتن حروف اول اسم
    // ==============================
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        const initials = parts.map(p => p[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };

    // ==============================
    // در حال بارگذاری - فقط این بخش لود میشه
    // ==============================
    if (loading) {
        return (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80">
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-28 animate-pulse" />
                </div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    // ==============================
    // نمایش اطلاعات کاربر
    // ==============================
    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80">
            <AvatarWithOutLink
                name={user?.name || 'کاربر'}
                size="sm"  // سایز کوچک (w-8 h-8)
            />

            {/* اطلاعات کاربر */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.name || 'کاربر'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                    {user?.email || 'no-email@example.com'}
                </p>
            </div>

            {/* دکمه خروج */}
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                title="خروج از حساب"
            >
                {isLoggingOut ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                )}
            </button>
        </div>
    );
}