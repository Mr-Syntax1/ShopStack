'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatDateTime, formatPrice, toPersianDigits } from '@/lib/persian';
import StatusBadge from '@/components/StatusBadge';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AvatarWithOutLink } from '@/components/Avatar';

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

// ==============================
// آیکون‌های سایدبار
// ==============================
const ICONS = {
    profile: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    orders: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    ),
    invoice: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
};

const MENU = [
    { key: 'profile', label: 'اطلاعات پروفایل', icon: ICONS.profile },
    { key: 'orders', label: 'سفارشات من', icon: ICONS.orders },
    { key: 'invoices', label: 'فاکتورها', icon: ICONS.invoice },
    { key: 'logout', label: 'خروج از حساب', icon: ICONS.logout },
];

// ==============================
// کامپوننت اصلی صفحه پروفایل
// ==============================
export default function ProfilePage() {
    const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    const [active, setActive] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [paymentsMap, setPaymentsMap] = useState({});
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    // مودال جزئیات سفارش
    const [selectedOrder, setSelectedOrder] = useState(null);

    // ==============================
    // React Hook Form + Yup
    // ==============================
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm({
        resolver: yupResolver(profileSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    });

    const phone = watch('phone');

    // ==============================
    // هدایت به ورود اگر لاگین نیست
    // ==============================
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // ==============================
    // مقداردهی اولیه فرم با اطلاعات کاربر
    // ==============================
    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('phone', user.phone || '');
        }
    }, [user, setValue]);

    // ==============================
    // بارگذاری سفارشات کاربر
    // ==============================
    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch('/api/orders');
            if (!res.ok) throw new Error('خطا در دریافت سفارشات');
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);

            const map = {};
            await Promise.all(
                (Array.isArray(data) ? data : []).map(async (order) => {
                    try {
                        const payRes = await fetch(`/api/payments/order/${order._id}`);
                        if (payRes.ok) {
                            const payData = await payRes.json();
                            map[order._id] = payData;
                        }
                    } catch {
                        // ignore
                    }
                })
            );
            setPaymentsMap(map);
        } catch (err) {
            toast.error(err.message || 'خطا در بارگذاری سفارشات');
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (active === 'orders' || active === 'invoices') {
            fetchOrders();
        }
    }, [active]);

    // ==============================
    // بروزرسانی پروفایل
    // ==============================
    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'خطا در بروزرسانی');
            toast.success('پروفایل با موفقیت بروزرسانی شد');
            setEditing(false);
            router.refresh();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // خروج از حساب
    // ==============================
    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            toast.error('خطا در خروج');
        }
    };

    // ==============================
    // لودینگ یا عدم احراز هویت
    // ==============================
    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ==============================
    // رندر محتوای تب‌ها
    // ==============================
    const renderContent = () => {
        if (active === 'profile') {
            return (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6 sm:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">اطلاعات پروفایل</h2>
                            <p className="text-sm text-gray-400 mt-1">اطلاعات حساب کاربری خود را مدیریت کنید</p>
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
                            >
                                ویرایش اطلاعات
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* نام و نام خانوادگی */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">نام و نام خانوادگی</label>
                                <input
                                    type="text"
                                    {...register('name')}
                                    disabled={!editing}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${editing
                                        ? `border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white ${errors.name ? 'border-red-500' : ''
                                        }`
                                        : 'border-transparent bg-gray-50/50 text-gray-800'
                                        }`}
                                />
                                {errors.name && editing && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* ایمیل */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">ایمیل</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    disabled={!editing}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${editing
                                        ? `border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white ${errors.email ? 'border-red-500' : ''
                                        }`
                                        : 'border-transparent bg-gray-50/50 text-gray-800'
                                        }`}
                                />
                                {errors.email && editing && (
                                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* شماره موبایل - در ردیف جداگانه */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">شماره موبایل</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        {...register('phone')}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${editing
                                            ? `border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white ${errors.phone ? 'border-red-500' : ''
                                            }`
                                            : 'border-transparent bg-gray-50/50 text-gray-800'
                                            }`}
                                        placeholder="09123456789"
                                    />
                                </div>
                                {errors.phone && editing && (
                                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                                )}
                                {phone && !errors.phone && editing && (
                                    <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        شماره موبایل معتبر است
                                    </p>
                                )}
                            </div>

                            {/* نقش */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">نقش</label>
                                <input
                                    type="text"
                                    value={user.role === 'admin' ? 'مدیر' : 'کاربر'}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-transparent bg-gray-50/50 text-gray-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* تاریخ عضویت */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">تاریخ عضویت</label>
                                <input
                                    type="text"
                                    value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '-'}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-transparent bg-gray-50/50 text-gray-500 text-sm"
                                />
                            </div>
                        </div>

                        {editing && (
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving || !isValid}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {saving ? (
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        setValue('name', user.name || '');
                                        setValue('email', user.email || '');
                                        setValue('phone', user.phone || '');
                                    }}
                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    انصراف
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            );
        }

        if (active === 'orders') {
            return (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden"
                >
                    <div className="p-6 sm:p-8 border-b border-gray-100/50">
                        <h2 className="text-xl font-bold text-gray-800">سفارشات من</h2>
                        <p className="text-sm text-gray-400 mt-1">لیست کامل سفارشات ثبت شده در حساب شما</p>
                    </div>

                    {loadingOrders ? (
                        <div className="p-8 flex justify-center">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">هنوز سفارشی ثبت نکرده‌اید</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-50/80 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">شماره سفارش</th>
                                        <th className="px-6 py-3 font-medium">تاریخ</th>
                                        <th className="px-6 py-3 font-medium">تعداد محصول</th>
                                        <th className="px-6 py-3 font-medium">مبلغ کل</th>
                                        <th className="px-10 py-3 font-medium">وضعیت سفارش</th>
                                        <th className="px-10 py-3 font-medium">وضعیت پرداخت</th>
                                        <th className="px-6 py-3 font-medium">جزئیات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/60">
                                    {orders.map((order) => {
                                        const payment = paymentsMap[order._id];
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                                    #{(order._id).slice(-8)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {order.cart?.length || 0} عدد
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800">
                                                    {formatPrice(Math.round(order.totalPrice || 0))} <span className="text-[10px] text-gray-400">تومان</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge type="order" status={order.status} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {payment ? (
                                                        <StatusBadge type="payment" status={payment.status} />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">نامشخص</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
                                                    >
                                                        مشاهده
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            );
        }

        if (active === 'invoices') {
            return (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden"
                >
                    <div className="p-6 sm:p-8 border-b border-gray-100/50">
                        <h2 className="text-xl font-bold text-gray-800">فاکتورها</h2>
                        <p className="text-sm text-gray-400 mt-1">وضعیت فاکتورهای پرداخت مربوط به سفارشات شما</p>
                    </div>

                    {loadingOrders ? (
                        <div className="p-8 flex justify-center">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">فاکتوری ثبت نشده است</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-50/80 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">شناسه فاکتور</th>
                                        <th className="px-6 py-3 font-medium">مبلغ</th>
                                        <th className="px-6 py-3 font-medium">وضعیت پرداخت</th>
                                        <th className="px-6 py-3 font-medium">زمان پرداخت</th>
                                        <th className="px-6 py-3 font-medium">اطلاعات پرداخت‌کننده</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/60">
                                    {orders.map((order) => {
                                        const payment = paymentsMap[order._id];
                                        if (!payment) return null;
                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                                    {toPersianDigits(payment.invoiceId)}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800">
                                                    {formatPrice(Math.round((payment.finalAmount || payment.amount || 0) / 10))} <span className="text-[10px] text-gray-400">تومان</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge type="payment" status={payment.status} />
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {payment.paidAt ? formatDateTime(payment.paidAt) : '-'}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {payment.payer?.name || '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    // ==============================
    // رندر اصلی
    // ==============================
    return (
        <div
            className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-indigo-50/30"
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-duration="800"
            data-aos-easing="ease-out-cubic"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* سایدبار */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-4 sticky top-24">
                            <div className="flex items-center gap-3 px-3 py-3 mb-4">
                                <AvatarWithOutLink
                                    name={user?.name}
                                    // href="/profile"
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {MENU.map((item) => {
                                    if (item.key === 'logout') {
                                        return (
                                            <button
                                                key={item.key}
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            >
                                                <span className="text-rose-500">{item.icon}</span>
                                                {item.label}
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={item.key}
                                            onClick={() => setActive(item.key)}
                                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${active === item.key ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                                        >
                                            <span className={active === item.key ? 'text-indigo-600' : 'text-gray-400'}>{item.icon}</span>
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* محتوای اصلی */}
                    <main className="lg:col-span-3">
                        {renderContent()}
                    </main>
                </div>

                {/* مودال جزئیات سفارش */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100/60">
                                <h3 className="text-lg font-bold text-gray-800">جزئیات سفارش</h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">شماره سفارش</p>
                                        <p className="font-mono text-gray-800 mt-1">#{(String(selectedOrder._id).slice(-8))}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">تاریخ ثبت</p>
                                        <p className="text-gray-800 mt-1">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('fa-IR') : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">وضعیت سفارش</p>
                                        <div className="mt-1">
                                            <StatusBadge type="order" status={selectedOrder.status} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">مبلغ کل</p>
                                        <p className="text-gray-800 mt-1 font-semibold">{formatPrice(Math.round(selectedOrder.totalPrice || 0))} <span className="text-[10px] text-gray-400">تومان</span></p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-3">محصولات</p>
                                    <div className="space-y-3">
                                        {selectedOrder.cart?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 border border-gray-100/60">
                                                <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        'تصویر'
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                                    <p className="text-xs text-gray-400">تعداد: {item.quantity}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-semibold text-gray-800">{formatPrice(Math.round(item.price || 0))} <span className="text-[10px] text-gray-400">تومان</span></p>
                                                    {item.discount > 0 && (
                                                        <p className="text-[10px] text-rose-500">{item.discount}% تخفیف</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400">تحویل‌گیرنده</p>
                                        <p className="text-gray-800 mt-1">{selectedOrder.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">شهر</p>
                                        <p className="text-gray-800 mt-1">{selectedOrder.user?.city || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-400">آدرس</p>
                                        <p className="text-gray-800 mt-1">{selectedOrder.user?.address || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}