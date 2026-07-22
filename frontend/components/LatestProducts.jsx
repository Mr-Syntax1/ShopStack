// components/LatestProducts.jsx
import Link from 'next/link';
import Productlist from './ProductList';

export default async function LatestProducts() {
    const res = await fetch('http://localhost:3000/api/products')

    if (!res.ok) {
        throw new Error('خطا در دریافت محصولات');
    }

    const allProducts = await res.json();
    const products = allProducts.slice(0, 8); // فقط ۸ محصول اول

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-blue-50/30 via-white to-indigo-50/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-14">
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

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 vazir-medium">
                            محصولات
                            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent vazir-medium"> پر فروش</span>
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

                {/* آمار فروشگاه
                <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50">
                        <div className="w-14 h-14 mx-auto bg-blue-100/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors duration-300 mb-3">
                            📦
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                        <p className="text-sm text-gray-500">محصولات موجود</p>
                    </div>

                    <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50">
                        <div className="w-14 h-14 mx-auto bg-green-100/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-100 transition-colors duration-300 mb-3">
                            ✅
                        </div>
                        <p className="text-2xl font-bold text-green-600">۱۰۰%</p>
                        <p className="text-sm text-gray-500">کیفیت تضمینی</p>
                    </div>

                    <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50">
                        <div className="w-14 h-14 mx-auto bg-purple-100/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-100 transition-colors duration-300 mb-3">
                            🚀
                        </div>
                        <p className="text-2xl font-bold text-purple-600">۲۴ ساعته</p>
                        <p className="text-sm text-gray-500">ارسال سریع</p>
                    </div>
                </div> */}

            </div>
        </section>
    );
}