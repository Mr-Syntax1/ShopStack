'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'; // مدیریت فرم
import { yupResolver } from '@hookform/resolvers/yup';// اتصال Yup به React Hook Form
import * as yup from 'yup'; // اعتبارسنجی
import { useAuth } from '@/context';

// ==============================
// Schema اعتبارسنجی با Yup (قوانین ورودی)
// ==============================
const loginSchema = yup.object({
    identifier: yup
        .string()
        .required('ایمیل یا شماره موبایل الزامی است')
        .test('is-valid-identifier', 'ایمیل یا شماره موبایل معتبر وارد کنید', (value) => {
            if (!value) return false;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^09[0-9]{9}$/;
            return emailRegex.test(value) || phoneRegex.test(value);
        }),
    password: yup
        .string()
        .required('رمز عبور الزامی است')
        .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register,// برای اتصال فیلدهای فرم به react-hook-form
        handleSubmit,// برای مدیریت رویداد ارسال فرم
        setValue,// برای تنظیم دستی مقدار یک فیلد (اینجا برای بارگذاری مقدار ذخیره شده)
        watch,// برای گوش دادن به تغییرات یک فیلد (اینجا برای تشخیص نوع ورودی)
        formState: { errors, isValid, isSubmitted },
    } = useForm({
        resolver: yupResolver(loginSchema),// قوانین اعتبارسنجی از yup
        mode: 'onChange',// اعتبارسنجی در هر تغییر
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const identifier = watch('identifier');

    // تشخیص خودکار نوع ورودی
    useEffect(() => {
        if (identifier) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^09[0-9]{9}$/;

            if (emailRegex.test(identifier)) {
                setLoginMethod('email');
            } else if (phoneRegex.test(identifier)) {
                setLoginMethod('phone');
            }
        }
    }, [identifier]);

    // بارگذاری identifier ذخیره شده
    useEffect(() => {
        const savedIdentifier = localStorage.getItem('rememberedIdentifier');
        if (savedIdentifier) {
            setValue('identifier', savedIdentifier);
            setRememberMe(true);
        }
    }, [setValue]);

    // تابع ارسال فرم
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // تشخیص اینکه identifier ایمیل هست یا موبایل
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isEmail = emailRegex.test(data.identifier);

            // آماده‌سازی داده برای سرور
            const payload = {
                password: data.password,
            };

            // اگر ایمیل بود به عنوان email ارسال کن، در غیر این صورت به عنوان phone
            if (isEmail) {
                payload.email = data.identifier;
            } else {
                payload.phone = data.identifier;
            }
            // console.log('Sending payload:', payload); // برای دیباگ

            const result = await login(data.identifier, data.password);

            if (!result.success) {
                throw new Error(result.error || 'خطا در ورود');
            }

            if (rememberMe) {
                localStorage.setItem('rememberedIdentifier', data.identifier);
            } else {
                localStorage.removeItem('rememberedIdentifier');
            }


        } catch (error) {
            toast.error(error.message);
            console.error('Login error:', error);
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

    const EmailIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );

    const PhoneIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-50 to-violet-100 p-4">
            <div
                data-aos="fade-up"
                data-aos-duration="800"
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center"
                    >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l-4-8H5.3m6 12h7a2 2 0 002-2v-4a2 2 0 00-2-2h-7m6 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                    </div>
                    <h1
                        className="text-3xl font-bold text-gray-800 mt-4"
                    >
                        ورود به حساب
                    </h1>
                    <p
                        className="text-gray-500 text-sm mt-1"
                    >
                        با ایمیل یا شماره موبایل وارد شوید
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                    {/* ایمیل یا شماره موبایل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            ایمیل یا شماره موبایل
                        </label>
                        <div className="relative">
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {loginMethod === 'email' ? <EmailIcon /> : <PhoneIcon />}
                            </div>

                            <input
                                type="text"
                                {...register('identifier')}
                                className={`w-full px-4 py-3 pr-12 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 ${errors.identifier ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="ایمیل یا شماره موبایل"
                                dir="ltr"
                            />
                        </div>
                        {errors.identifier && (
                            <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
                        )}
                        {identifier && !errors.identifier && (
                            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {loginMethod === 'email' ? 'ورود با ایمیل' : 'ورود با شماره موبایل'}
                            </p>
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
                                placeholder="*********"
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

                    {/* گزینه‌های اضافی */}
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
                            'ورود'
                        )}
                    </button>
                </form>

                <p
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="text-center text-sm text-gray-500 mt-4"
                >
                    حساب ندارید؟{' '}
                    <Link href="/auth/register" className="text-indigo-600 hover:underline font-medium">
                        ثبت‌نام کنید
                    </Link>
                </p>
            </div>
        </div>
    );
}