'use client';

import Link from 'next/link';

export default function LatestProductsError() {
    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-blue-50/50 via-white to-indigo-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="max-w-md mx-auto">
                    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 text-center">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="inline-block mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-ping">
                                        <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-orange-400 rounded-full opacity-20"></div>
                                    </div>
                                    <div className="relative w-20 h-20 bg-linear-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                                        <span className="text-4xl">⚠️</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                                خطا در بارگذاری محصولات
                            </h3>
                            <p className="text-gray-500 text-base sm:text-lg mb-8 leading-relaxed">
                                متأسفانه در دریافت اطلاعات محصولات مشکلی پیش آمده است.
                                <br />
                                لطفاً دوباره تلاش کنید.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-blue-500/25 group cursor-pointer"
                                >
                                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    تلاش مجدد
                                </button>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:scale-105 border border-gray-200/50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    بازگشت به صفحه اصلی
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
