'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// Schema اعتبارسنجی با Yup
// ==============================
const profileSchema = yup.object({
    name: yup
        .string()
        .required('نام و نام خانوادگی الزامی است')
        .min(3, 'نام باید حداقل ۳ کاراکتر باشد')
        .max(50, 'نام نباید بیشتر از ۵۰ کاراکتر باشد'),
    email: yup
        .string()
        .required('ایمیل الزامی است')
        .email('ایمیل معتبر وارد کنید'),
    phone: yup
        .string()
        .required('شماره موبایل الزامی است')
        .matches(/^09[0-9]{9}$/, 'شماره موبایل باید 11 رقم و با 09 شروع شود'),
});

const passwordSchema = yup.object({
    currentPassword: yup
        .string()
        .required('رمز عبور فعلی الزامی است'),
    newPassword: yup
        .string()
        .required('رمز عبور جدید الزامی است')
        .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: yup
        .string()
        .required('تایید رمز عبور الزامی است')
        .oneOf([yup.ref('newPassword')], 'رمزهای عبور مطابقت ندارند'),
});

// ==============================
// کامپوننت اصلی تنظیمات
// ==============================
export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // ==============================
    // فرم پروفایل
    // ==============================
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setValueProfile,
        formState: { errors: errorsProfile, isValid: isValidProfile, isDirty: isDirtyProfile },
    } = useForm({
        resolver: yupResolver(profileSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    });

    // ==============================
    // فرم تغییر رمز عبور
    // ==============================
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: errorsPassword, isValid: isValidPassword },
    } = useForm({
        resolver: yupResolver(passwordSchema),
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // ==============================
    // دریافت اطلاعات کاربر
    // ==============================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/me`, {
                    credentials: 'include',
                });
                if (!res.ok) {
                    router.push('/auth/login');
                    return;
                }
                const data = await res.json();
                setUser(data.user);
                setValueProfile('name', data.user?.name || '');
                setValueProfile('email', data.user?.email || '');
                setValueProfile('phone', data.user?.phone || '');
            } catch (error) {
                console.error('Error fetching user:', error);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router, setValueProfile]);

    // ==============================
    // بروزرسانی پروفایل
    // ==============================
    const onSubmitProfile = async (data) => {
        setSavingProfile(true);
        try {
            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'خطا در بروزرسانی');
            toast.success('پروفایل با موفقیت بروزرسانی شد');
            setUser(prev => ({ ...prev, ...data }));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    // ==============================
    // تغییر رمز عبور
    // ==============================
    const onSubmitPassword = async (data) => {
        setSavingPassword(true);
        try {
            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'خطا در تغییر رمز عبور');
            toast.success('رمز عبور با موفقیت تغییر کرد');
            resetPassword();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    // ==============================
    // لودینگ
    // ==============================
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ==============================
    // رندر تب‌ها
    // ==============================
    const renderContent = () => {
        if (activeTab === 'profile') {
            return (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">اطلاعات پروفایل</h2>
                            <p className="text-sm text-gray-400 mt-1">اطلاعات حساب کاربری خود را مدیریت کنید</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* نام و نام خانوادگی */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">نام و نام خانوادگی</label>
                                <input
                                    type="text"
                                    {...registerProfile('name')}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errorsProfile.name ? 'border-red-500' : 'border-gray-200'}`}
                                />
                                {errorsProfile.name && (
                                    <p className="text-xs text-red-500 mt-1">{errorsProfile.name.message}</p>
                                )}
                            </div>

                            {/* ایمیل */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ایمیل</label>
                                <input
                                    type="email"
                                    {...registerProfile('email')}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errorsProfile.email ? 'border-red-500' : 'border-gray-200'}`}
                                />
                                {errorsProfile.email && (
                                    <p className="text-xs text-red-500 mt-1">{errorsProfile.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* شماره موبایل */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">شماره موبایل</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    {...registerProfile('phone')}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errorsProfile.phone ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="09123456789"
                                />
                            </div>
                            {errorsProfile.phone && (
                                <p className="text-xs text-red-500 mt-1">{errorsProfile.phone.message}</p>
                            )}
                        </div>

                        {/* نقش */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">نقش</label>
                            <input
                                type="text"
                                defaultValue={user?.role === 'admin' ? 'مدیر' : 'کاربر'}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-transparent bg-gray-50/50 text-gray-500 text-sm"
                            />
                        </div>

                        {/* دکمه‌ها */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={savingProfile || !isValidProfile || !isDirtyProfile}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {savingProfile ? (
                                    <>
                                        <svg className="w-4 h-4 inline animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        در حال ذخیره...
                                    </>
                                ) : (
                                    'ذخیره تغییرات'
                                )}
                            </button>
                            {isDirtyProfile && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setValueProfile('name', user?.name || '');
                                        setValueProfile('email', user?.email || '');
                                        setValueProfile('phone', user?.phone || '');
                                    }}
                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    انصراف
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            );
        }

        if (activeTab === 'password') {
            return (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">تغییر رمز عبور</h2>
                        <p className="text-sm text-gray-400 mt-1">رمز عبور خود را به صورت دوره‌ای تغییر دهید</p>
                    </div>

                    <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-5 max-w-lg">
                        {/* رمز عبور فعلی */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز عبور فعلی</label>
                            <input
                                type="password"
                                {...registerPassword('currentPassword')}
                                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errorsPassword.currentPassword ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="رمز عبور فعلی را وارد کنید"
                            />
                            {errorsPassword.currentPassword && (
                                <p className="text-xs text-red-500 mt-1">{errorsPassword.currentPassword.message}</p>
                            )}
                        </div>

                        {/* رمز عبور جدید */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز عبور جدید</label>
                            <input
                                type="password"
                                {...registerPassword('newPassword')}
                                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errorsPassword.newPassword ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="رمز عبور جدید را وارد کنید"
                            />
                            {errorsPassword.newPassword && (
                                <p className="text-xs text-red-500 mt-1">{errorsPassword.newPassword.message}</p>
                            )}
                        </div>

                        {/* تایید رمز عبور */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">تایید رمز عبور جدید</label>
                            <input
                                type="password"
                                {...registerPassword('confirmPassword')}
                                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errorsPassword.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="رمز عبور جدید را مجدداً وارد کنید"
                            />
                            {errorsPassword.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errorsPassword.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* دکمه */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={savingPassword || !isValidPassword}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {savingPassword ? (
                                    <>
                                        <svg className="w-4 h-4 inline animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        در حال تغییر...
                                    </>
                                ) : (
                                    'تغییر رمز عبور'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return null;
    };

    // ==============================
    // رندر اصلی
    // ==============================
    return (
        <div className="flex flex-col gap-4 sm:gap-6 mt-12 lg:mt-7 mr-5">
            {/* عنوان صفحه */}
            <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-800">تنظیمات</h1>
                    <p className="text-sm text-gray-500">مدیریت تنظیمات حساب کاربری</p>
                </div>
            </div>

            {/* تب‌ها */}
            <div className="flex items-center gap-1 border-b border-gray-200/80">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    پروفایل
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all cursor-pointer ${activeTab === 'password' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                    تغییر رمز عبور
                </button>
            </div>

            {/* محتوای تب */}
            {renderContent()}
        </div>
    );
}
