'use client'
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/context';

// ==============================
// Schema اعتبارسنجی با Yup
// ==============================
const registerSchema = yup.object({
    name: yup
        .string()
        .required('نام و نام خانوادگی الزامی است')
        .min(3, 'نام باید حداقل ۳ کاراکتر باشد')
        .max(50, 'نام نباید بیشتر از ۵۰ کاراکتر باشد'),

    email: yup
        .string()
        .required('ایمیل الزامی است')
        .email('ایمیل معتبر وارد کنید')
        .test('is-company-email', 'ایمیل معتبر وارد کنید', (value) => {
            if (!value) return false;
            const allowedDomains = ['gmail.com', 'yahoo.com', 'company.com', 'myorg.org'];
            const domain = value.split('@')[1];
            return allowedDomains.includes(domain);
            // بررسی کن که دامنه در لیست مجاز هست یا نه
        }),
    phone: yup
        .string()
        .required('شماره موبایل الزامی است')
        .matches(/^(0?9[0-9]{9}|9[0-9]{9})$/, 'شماره موبایل معتبر وارد کنید'),

    password: yup
        .string()
        .required('رمز عبور الزامی است')
        .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
        .matches(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد')
        .matches(/[a-z]/, 'رمز عبور باید حداقل یک حرف کوچک داشته باشد')
        .matches(/[0-9]/, 'رمز عبور باید حداقل یک عدد داشته باشد'),

    confirmPassword: yup
        .string()
        .required('تکرار رمز عبور الزامی است')
        .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن مطابقت ندارند'),
});

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema), // اتصال به اعتبارسنجی Yup
        mode: 'onChange',// اعتبارسنجی در هر تغییر
    });

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // اول بررسی یونیک بودن ایمیل و شماره
            const [emailCheck, phoneCheck] = await Promise.all([
                fetch(`/api/auth/check-unique?email=${data.email}`)
                    .then(res => res.json())
                    .catch(() => ({ emailExists: false })), // اگر خطا خورد، فرض کنید وجود نداره
                fetch(`/api/auth/check-unique?phone=${data.phone}`)
                    .then(res => res.json())
                    .catch(() => ({ phoneExists: false }))
            ]);

            if (emailCheck.emailExists) {
                setError('email', {
                    type: 'manual',
                    message: 'این ایمیل قبلاً ثبت شده است'
                });
                setLoading(false);
                return;
            }

            if (phoneCheck.phoneExists) {
                setError('phone', {
                    type: 'manual',
                    message: 'این شماره موبایل قبلاً ثبت شده است'
                });
                setLoading(false);
                return;
            }

            // استفاده از Context به جای fetch مستقیم
            const result = await registerUser(
                data.name,
                data.email,
                data.phone,
                data.password
            );

            if (!result.success) {
                throw new Error(result.error || 'خطا در ثبت‌نام');
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // آیکون چشم باز
    const EyeOpenIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    // آیکون چشم بسته
    const EyeClosedIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-50 to-violet-100 p-4 mt-20">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l-4-8H5.3m6 12h7a2 2 0 002-2v-4a2 2 0 00-2-2h-7m6 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mt-4">ثبت نام</h1>
                    <p className="text-gray-500 text-sm mt-1">حساب کاربری جدید بسازید</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                    {/* نام و نام خانوادگی */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
                        <input
                            type="text"
                            {...register('name')}
                            className={`w-full px-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500  focus:border-transparent transition-colors placeholder-gray-400 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="علی محمدی"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* ایمیل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={`w-full px-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500  focus:border-transparent transition-colors placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="example@email.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* شماره موبایل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">شماره موبایل</label>
                        <div className="relative">
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                                +98
                            </span>
                            <input
                                type="tel"
                                {...register('phone')}
                                className={`w-full px-4 py-3 pr-14 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500  focus:border-transparent transition-colors placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="9123456789"
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* رمز عبور */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className={`w-full px-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500  focus:border-transparent transition-colors placeholder-gray-400 pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="حداقل ۶ کاراکتر"
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

                    {/* تکرار رمز عبور */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تکرار رمز عبور</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                className={`w-full px-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500  focus:border-transparent transition-colors placeholder-gray-400 pr-12 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="رمز عبور را دوباره وارد کنید"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* نمایش وضعیت تطابق رمزها */}
                    {password && confirmPassword && !errors.password && !errors.confirmPassword && (
                        <div className="text-xs flex items-center gap-1.5 text-emerald-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            رمز عبور مطابقت دارد
                        </div>
                    )}

                    {/* قوانین رمز عبور */}
                    {password && (
                        <div className="text-xs text-gray-400 space-y-1 bg-gray-50 p-3 rounded-xl">
                            <p className="font-medium text-gray-600">قوانین رمز عبور:</p>
                            <ul className="space-y-0.5 pr-4 list-disc">
                                <li className={password.length >= 6 ? 'text-emerald-500' : ''}>
                                    حداقل ۶ کاراکتر
                                </li>
                                <li className={/[A-Z]/.test(password) ? 'text-emerald-500' : ''}>
                                    حداقل یک حرف بزرگ (A-Z)
                                </li>
                                <li className={/[a-z]/.test(password) ? 'text-emerald-500' : ''}>
                                    حداقل یک حرف کوچک (a-z)
                                </li>
                                <li className={/[0-9]/.test(password) ? 'text-emerald-500' : ''}>
                                    حداقل یک عدد (0-9)
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                در حال ثبت‌نام...
                            </>
                        ) : (
                            'ثبت‌نام'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    قبلاً حساب دارید؟{' '}
                    <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">
                        وارد شوید
                    </Link>
                </p>
            </div>
        </div>
    );
}