// components/cart/EmptyCart.jsx
'use client'

import Link from "next/link";

export default function EmptyCart({ error = null }) {
    // تابع ریلود داخل خود کامپوننت کلاینت
    const handleRetry = () => {
        window.location.reload();
    };

    // حالت خطا
    if (error) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100/50">
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-xl shadow-red-500/10 animate-bounce-slow">
                        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">مشکلی پیش آمده!</h2>
                <p className="text-gray-500 mb-2">{error}</p>
                <p className="text-sm text-gray-400 mb-6">لطفاً دوباره تلاش کنید</p>
                <button
                    onClick={handleRetry}
                    className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                    تلاش مجدد
                </button>
            </div>
        );
    }

    // حالت عادی - سبد خالی
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100/50">
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
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
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
                شروع خرید
            </Link>
        </div>
    );
}