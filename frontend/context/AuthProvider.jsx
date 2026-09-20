// context/AuthProvider.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ==============================
// ایجاد Context
// ==============================
const AuthContext = createContext();

// ==============================
// Hook برای استفاده از Auth
// ==============================
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// ==============================
// Provider اصلی
// ==============================
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // ==============================
    // دریافت اطلاعات کاربر در اولین بار
    // ==============================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');

                //  چک کن پاسخ JSON باشه
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    // پاسخ HTML یا چیز دیگه → کاربر مهمان
                    setUser(null);
                    return;
                }

                if (!res.ok) {
                    // 401/403 → کاربر مهمان
                    setUser(null);
                    return;
                }

                const data = await res.json();
                setUser(data.user ?? null);

            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // ==============================
    // تابع ورود login
    // ==============================
    const login = async (identifier, password) => {
        try {
            // تشخیص اینکه identifier ایمیل هست یا موبایل
            const isEmail = identifier.includes('@');
            const payload = {
                password: password,
            };

            if (isEmail) {
                payload.email = identifier;
            } else {
                payload.phone = identifier;
            }

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'خطا در ورود');
            }

            // ==============================
            // اگر ادمینه → redirectTo از API میاد (SSO)
            // ==============================
            if (data.redirectTo) {
                toast.success(data.message || 'به پنل مدیریت هدایت می‌شوید...');
                window.location.assign(data.redirectTo);
                return { success: true };
            }

            // ==============================
            // کاربر عادی
            // ==============================
            setUser(data.user);

            toast.success('خوش آمدید!');
            router.push('/products');

            return { success: true };

        } catch (error) {
            toast.error(error.message);
            return { success: false, error: error.message };
        }
    };

    // ==============================
    // تابع ثبت نام register
    // ==============================
    const register = async (name, email, phone, password) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'خطا در ثبت‌نام');
            }

            // ذخیره اطلاعات کاربر
            setUser(data.user);

            toast.success('ثبت‌نام با موفقیت انجام شد!');
            router.push('/products');
            router.refresh();
            return { success: true };
        } catch (error) {
            toast.error(error.message);
            return { success: false, error: error.message };
        }
    };

    // ==============================
    // تابع خروج
    // ==============================
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            toast.success('با موفقیت خارج شدید');
            router.push('/auth/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('خطا در خروج');
        }
    };

    // ==============================
    // تابع به‌روزرسانی اطلاعات کاربر
    // ==============================
    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    // ==============================
    // مقدار Context خروجی
    // ==============================
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user, // آیا کاربر لاگین کرده
        isAdmin: user?.role === 'admin',
        isUser: user?.role === 'user',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}