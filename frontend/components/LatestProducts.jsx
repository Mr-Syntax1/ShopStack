// components/LatestProducts.jsx
import Link from 'next/link';
import Productlist from './ProductList';

export default async function LatestProducts() {
    try {
        // Use the full URL with environment variable
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/products`, {
            next: { revalidate: 60 } // Revalidate every 60 seconds for ISR
        });

        if (!res.ok) {
            throw new Error(`خطا در دریافت محصولات: ${res.status}`);
        }

        const allProducts = await res.json();
        const products = allProducts.slice(0, 8); // فقط ۸ محصول اول

        return (
            <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-blue-50/30 via-white to-indigo-50/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    {/* هدر بخش */}
                    <div className="relative mb-12 sm:mb-16">
                        <div className="text-center">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100/70 px-5 py-2 rounded-full mb-4 backdrop-blur-sm border border-blue-200/50">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                جدیدترین محصولات
                            </span>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 ">
                                محصولات
                                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent "> پر فروش</span>
                            </h2>

                            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
                                بهترین و محبوب‌ترین محصولات فروشگاه رو با بهترین قیمت تهیه کنید
                            </p>
                        </div>

                        {/* دکمه مشاهده همه */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-blue-200/50"
                            >
                                مشاهده همه
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* لیست محصولات */}
                    <Productlist products={products} />
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error in LatestProducts:', error);

        // Fallback UI when products fail to load
        return (
            <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-blue-50/50 via-white to-indigo-50/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="max-w-md mx-auto">
                        {/* Card container with glassmorphism effect */}
                        <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 text-center">
                            {/* Animated linear background */}
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>

                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Animated icon */}
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

                                {/* Title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                                    خطا در بارگذاری محصولات
                                </h3>

                                {/* Description */}
                                <p className="text-gray-500 text-base sm:text-lg mb-8 leading-relaxed">
                                    متأسفانه در دریافت اطلاعات محصولات مشکلی پیش آمده است.
                                    <br />
                                    لطفاً دوباره تلاش کنید.
                                </p>

                                {/* Action buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-blue-500/25 group"
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
}