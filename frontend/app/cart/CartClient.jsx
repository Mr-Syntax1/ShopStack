'use client'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatPrice } from '../../lib/persian';
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context";
import Error from "@/components/Error";
import { showOrderSuccessToast, showErrorToast } from "@/components/CustomToast";
import ConfirmModal from "@/components/ConfirmModal";
import { orderSchema } from "@/lib/validations";


export default function CartClient() {
    const { user, isAuthenticated } = useAuth();
    const [error, setError] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const {
        cart: items,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        cartTotal,
        finalTotal: total,
        shippingCost,
        getDiscountedPrice,
        getItemTotal,
        discountAmount,
        isLoading
    } = useCart();


    // ============================================
    // تنظیمات React Hook Form + Yup
    // ============================================
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(orderSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            city: '',
            postalCode: '',
            address: '',
            country: 'ایران',
        },
    });

    // ============================================
    // پر کردن خودکار فیلدها اگر کاربر لاگین کرده
    // ============================================
    useEffect(() => {
        if (isAuthenticated && user) {
            // ✅ فقط این ۳ تا فیلد رو پر کن
            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('phone', user.phone || '');
            // ❌ بقیه فیلدها خالی می‌مونن (city, postalCode, address, country)
        }
    }, [isAuthenticated, user, setValue]);

    // ============================================
    // ثبت سفارش
    // ============================================
    const onSubmit = async (data) => {
        if (items.length === 0) {
            showErrorToast('سبد خرید شما خالی است!');
            return;
        }

        // ✅ اگر کاربر لاگین نکرده → فقط توست خطا بده
        if (!isAuthenticated) {
            showErrorToast('لطفاً ابتدا وارد حساب کاربری خود شوید');
            return;
        }

        // ✅ اگر کاربر لاگین کرده → ادامه بده
        const cartWithProductId = items.map(item => ({
            productId: item._id || item.id,
            title: item.title,
            slug: item.slug,
            price: item.price,
            discount: item.discount || 0,
            quantity: item.quantity,
            image: item.image
        }));

        // ✅ از اطلاعات فرم استفاده کن (بعضی از فیلدها از کاربر پر شده)
        const orderData = {
            user: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                city: data.city,
                postalCode: data.postalCode,
                address: data.address,
                country: data.country || 'ایران',
            },
            cart: cartWithProductId,
            totalPrice: total
        };

        try {
            const res = await fetch('/api/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const response = await res.json();

            if (res.ok && response.paymentLink) {
                clearCart();
                reset();
                window.location.href = response.paymentLink;
            } else {
                showErrorToast(response.error || 'خطا در آغاز پرداخت');
            }
        } catch (error) {
            console.error('خطا در آغاز پرداخت:', error);
            showErrorToast('مشکلی در ارتباط با سرور پیش آمد.');
        }
    };

    // نمایش خطا
    if (error) {
        return <Error error={error} onRetry={() => window.location.reload()} />;
    }

    // حالت لودینگ
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-indigo-50/30 py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-16">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100/50">
                        <div className="flex justify-center items-center py-12">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-gray-500">در حال بارگذاری سبد خرید...</p>
                    </div>
                </div>
            </div>
        );
    }


    // ============================================
    // سبد خالی
    // ============================================
    if (items.length === 0) {
        return (
            <div
                className="page-enter min-h-screen bg-linear-to-br from-blue-50/30 via-white to-indigo-50/30 py-8 sm:py-12 lg:py-16"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-16">
                    <div
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100/50"
                    >
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
                            <div className="relative w-32 h-32 mx-auto bg-linear-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-xl shadow-blue-500/10 animate-bounce-slow">
                                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">سبد خرید شما خالی است</h2>
                        <p className="text-gray-400 mb-6">هنوز محصولی به سبد خرید اضافه نکردید</p>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                            شروع خرید
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    //  نمایش سبد خرید
    // ============================================
    return (
        <div
            className="page-enter min-h-screen bg-linear-to-br from-blue-50/30 via-white to-indigo-50/30 py-8 sm:py-12 lg:py-16"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-16">

                {/* عنوان صفحه */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shadow-blue-500/25">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 pb-3">سبد خرید</h1>
                            <p className="text-sm text-gray-400">محصولات انتخاب شده را مرور کنید</p>
                        </div>
                    </div>
                    <span className="text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        {items.length} محصول در سبد
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ============================================ */}
                    {/* ===== ستون چپ: لیست محصولات ===== */}
                    {/* ============================================ */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item._id || item.id}
                            >
                                <div
                                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                                        {/* تصویر */}
                                        <div className="relative w-full sm:w-28 h-72 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {item.discount > 0 && (
                                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                    {item.discount}%
                                                </span>
                                            )}
                                        </div>

                                        {/* اطلاعات */}
                                        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            <div className="flex-1">
                                                <Link href={`/products/${item.slug || item.id}`}>
                                                    <h3 className="font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer text-sm sm:text-base line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {formatPrice(getDiscountedPrice(item))}
                                                </p>
                                            </div>

                                            {/* تعداد */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            removeFromCart(item._id || item.id);
                                                        } else {
                                                            updateQuantity(item._id || item.id, item.quantity - 1);
                                                        }
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* قیمت کل با تخفیف */}
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-xs text-gray-400">قیمت کل</p>
                                                <p className="font-bold text-gray-800">
                                                    {formatPrice(getItemTotal(item))}
                                                </p>
                                            </div>

                                            {/* دکمه حذف */}
                                            <button
                                                onClick={() => removeFromCart(item._id || item.id)}
                                                className="absolute left-3 bottom-3 sm:relative sm:left-0 sm:bottom-0 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                                                aria-label="حذف"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* دکمه‌های پایین لیست */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <Link
                                href="/products"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                ادامه خرید
                            </Link>

                            <button
                                onClick={() => setShowClearModal(true)}
                                className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer px-3 py-1 hover:bg-red-50 rounded-lg flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                خالی کردن سبد
                            </button>
                        </div>
                    </div>


                    {/* ============================================ */}
                    {/* ====== ستون راست: اطلاعات و پرداخت ====== */}
                    {/* ============================================ */}
                    <div className="lg:col-span-1">
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-6 sticky top-24"
                        >

                            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100/50 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                خلاصه سفارش
                            </h2>

                            {/* جمع‌بندی قیمت‌ها */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">قیمت محصولات</span>
                                    <span className="font-medium text-gray-800">
                                        {formatPrice(subtotal)} <span className="text-[10px] text-gray-400">تومان</span>
                                    </span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="text-gray-500">تخفیف محصولات</span>
                                        <span className="font-medium">{formatPrice(discountAmount)}- <span className="text-[10px] text-green-400">تومان</span></span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-500">هزینه ارسال</span>
                                    {shippingCost === 0 ? (
                                        <span className="flex items-center gap-1 text-green-500 font-medium">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            رایگان
                                        </span>
                                    ) : (
                                        <span className="font-medium text-gray-800">
                                            {formatPrice(shippingCost)} <span className="text-[10px] text-gray-400">تومان</span>
                                        </span>
                                    )}
                                </div>

                                {shippingCost > 0 && cartTotal > 0 && (
                                    <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>
                                            {formatPrice(500000 - cartTotal)} تومان دیگر تا ارسال رایگان
                                        </span>
                                    </div>
                                )}

                                {shippingCost === 0 && cartTotal > 0 && (
                                    <div className="text-xs text-green-500 bg-green-50 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        هزینه ارسال برای شما رایگان شد
                                    </div>

                                )}

                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100/50">
                                    <span className="text-gray-800">مجموع</span>
                                    <span className="text-blue-600 text-xl">
                                        {formatPrice(total)} <span className="text-sm text-gray-400">تومان</span>
                                    </span>
                                </div>
                            </div>

                            {/* ===== فرم اطلاعات ===== */}
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    اطلاعات شما
                                    {isAuthenticated && (
                                        <span className="text-xs text-green-500 font-normal">(برخی فیلدها خودکار پر شدند)</span>
                                    )}
                                </h3>

                                {/* ===== نام - خودکار پر میشه ===== */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="نام و نام خانوادگی"
                                        {...register('name')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} transition-all outline-none text-sm bg-white/50 focus:bg-white ${isAuthenticated ? 'bg-gray-100 text-gray-700' : ''}`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* ===== ایمیل - خودکار پر میشه ===== */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="ایمیل"
                                        {...register('email')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} transition-all outline-none text-sm bg-white/50 focus:bg-white ${isAuthenticated ? 'bg-gray-100 text-gray-700' : ''}`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* ===== تلفن - خودکار پر میشه ===== */}
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="شماره تماس"
                                        {...register('phone')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} transition-all outline-none text-sm bg-white/50 focus:bg-white ${isAuthenticated ? 'bg-gray-100 text-gray-700' : ''}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                    )}
                                </div>

                                {/* ===== شهر - خالی ===== */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="شهر"
                                        {...register('city')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} transition-all outline-none text-sm bg-white/50 focus:bg-white`}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                                    )}
                                </div>

                                {/* ===== کد پستی - خالی ===== */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="کد پستی"
                                        {...register('postalCode')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.postalCode ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} transition-all outline-none text-sm bg-white/50 focus:bg-white`}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
                                    )}
                                </div>

                                {/* ===== آدرس - خالی ===== */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="آدرس کامل"
                                        {...register('address')}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'} transition-all outline-none text-sm bg-white/50 focus:bg-white`}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                                    )}
                                </div>

                                {/* ===== کشور - خالی ===== */}
                                {/* <div>
                                    <select
                                        {...register('country')}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white cursor-pointer"
                                    >
                                        <option value="ایران">🇮🇷 ایران</option>
                                        <option value="افغانستان">🇦🇫 افغانستان</option>
                                        <option value="ترکیه">🇹🇷 ترکیه</option>
                                        <option value="امارات">🇦🇪 امارات</option>
                                    </select>
                                </div> */}

                                {/* ===== دکمه پرداخت ===== */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            در حال پردازش...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            پرداخت آنلاین
                                        </>
                                    )}
                                </button>
                            </form>

                        </div>
                    </div>

                </div>
            </div>

            <ConfirmModal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                onConfirm={async () => {
                    setIsClearing(true);
                    try {
                        clearCart();
                        setShowClearModal(false);
                    } finally {
                        setIsClearing(false);
                    }
                }}
                title="خالی کردن سبد خرید"
                message="آیا از خالی کردن سبد خرید مطمئن هستید؟"
                confirmText="بله، خالی کن"
                cancelText="انصراف"
                isLoading={isClearing}
                highlightText="همه محصولات از سبد شما حذف خواهند شد!"
                iconColor="red"
            />
        </div>
    );
}