'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from '../../lib/persian';

const cartItems = [
    { id: 1, title: 'هدفون بی‌سیم سونی', price: 12000000, image: '/images/1.jpg', quantity: 2 },
    { id: 3, title: 'ساعت هوشمند اپل', price: 1500000, image: '/images/3.jpg', quantity: 1 },
];

export default function CartPage() {
    const [items, setItems] = useState(cartItems);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        postalCode: '',
        address: '',
        country: 'ایران',
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);//قبل تخفیف
    const shippingCost = subtotal > 500000 ? 0 : 50000;
    const total = subtotal + shippingCost;//بعد تخفیف

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const clearCart = () => {
        if (items.length === 0) return;
        if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟')) {
            setItems([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('درخواست پرداخت شما ثبت شد!');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-indigo-50/30 py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-16">

                {/* عنوان صفحه با استایل جدید */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12  from-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shadow-blue-500/25">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 pb-3 ">سبد خرید</h1>
                            <p className="text-sm text-gray-400">محصولات انتخاب شده را مرور کنید</p>
                        </div>
                    </div>
                    <span className="text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        {items.length} محصول در سبد
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100/50">
                        <div className="mb-6 relative">
                            {/* افکت پس‌زمینه */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />

                            {/* آیکون سبد خرید با SVG */}
                            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-xl shadow-blue-500/10 animate-bounce-slow">
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
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ===== ستون چپ: لیست محصولات ===== */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                                        {/* تصویر */}
                                        <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* اطلاعات */}
                                        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            <div className="flex-1">
                                                <Link href={`/products/${item.id}`}>
                                                    <h3 className="font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                                                        {item.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>

                                            {/* تعداد */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* قیمت کل */}
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-xs text-gray-400">قیمت کل</p>
                                                <p className="font-bold text-gray-800">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>

                                            {/* دکمه حذف */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                                                aria-label="حذف"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
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
                                    onClick={clearCart}
                                    className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer px-3 py-1 hover:bg-red-50 rounded-lg flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    خالی کردن سبد
                                </button>
                            </div>
                        </div>

                        {/* ===== ستون راست: اطلاعات و پرداخت ===== */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-6 sticky top-24">

                                {/* خلاصه سفارش */}
                                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100/50 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    خلاصه سفارش
                                </h2>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">قیمت محصولات</span>
                                        <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">هزینه ارسال</span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            رایگان
                                        </span>
                                    </div>
                                    {shippingCost === 0 && (
                                        <div className="text-xs text-green-500 bg-green-50 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100/50">
                                        <span className="text-gray-800">مجموع</span>
                                        <span className="text-blue-600 text-xl">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* فرم اطلاعات */}
                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        اطلاعات شما
                                    </h3>

                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="نام و نام خانوادگی"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="ایمیل"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="شهر"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                placeholder="کد پستی"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="آدرس کامل"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white cursor-pointer"
                                            required
                                        >
                                            <option value="ایران">🇮🇷 ایران</option>
                                            <option value="افغانستان">🇦🇫 افغانستان</option>
                                            <option value="ترکیه">🇹🇷 ترکیه</option>
                                            <option value="امارات">🇦🇪 امارات</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        پرداخت آنلاین
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}