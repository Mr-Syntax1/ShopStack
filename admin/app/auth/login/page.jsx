'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link'; // ← اضافه کنید

const API_CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL

// ==============================
// Schema اعتبارسنجی با Yup
// ==============================
const loginSchema = yup.object({
    email: yup
        .string()
        .required('ایمیل الزامی است')
        .email('ایمیل معتبر وارد کنید'),
    password: yup
        .string()
        .required('رمز عبور الزامی است')
        .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // بارگذاری ایمیل ذخیره شده
    useEffect(() => {
        const savedEmail = localStorage.getItem('adminRememberedEmail');
        if (savedEmail) {
            setValue('email', savedEmail);
            setRememberMe(true);
        }
    }, [setValue]);

    // ==============================
    // تابع ارسال فرم
    // ==============================
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'خطا در ورود');
            }

            // ==============================
            // بررسی اینکه کاربر ادمین است
            // ==============================
            if (result.user?.role !== 'admin') {
                toast.error('شما دسترسی به پنل مدیریت ندارید');
                return;
            }

            // ذخیره ایمیل در صورت انتخاب
            if (rememberMe) {
                localStorage.setItem('adminRememberedEmail', data.email);
            } else {
                localStorage.removeItem('adminRememberedEmail');
            }

            toast.success('خوش آمدید ادمین!');

            // هدایت به داشبورد
            router.push('/dashboard');
            router.refresh();

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // آیکون‌ها
    const EyeOpenIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const EyeClosedIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-violet-100 p-4 min-w-4xl">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l-4-8H5.3m6 12h7a2 2 0 002-2v-4a2 2 0 00-2-2h-7m6 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mt-4">پنل مدیریت</h1>
                    <p className="text-gray-500 text-sm mt-1">ورود به پنل مدیریت</p>
                </div>

                {/*  دکمه رفتن به فروشگاه */}
                <Link
                    href={API_CLIENT_URL}
                    className="flex items-center justify-center gap-2 w-full py-2.5 mb-4 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors border border-indigo-200/50"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    دکمه رفتن به فروشگاه

                </Link>

                {/* خط جداکننده */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-400">ورود به پنل مدیریت</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    {/* ایمیل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">ایمیل</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={`w-full px-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="admin@example.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* رمز عبور */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز عبور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className={`w-full px-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="********"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* گزینه مرا به خاطر بسپار */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>مرا به خاطر بسپار</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isValid}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                در حال ورود...
                            </>
                        ) : (
                            'ورود به پنل مدیریت'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}