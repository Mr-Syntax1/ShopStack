// components/LatestProducts.jsx
import Link from 'next/link';
import Productlist from './ProductList';
import LatestProductsError from './LatestProductsError';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function LatestProducts() {
    let products = [];

    try {
        const res = await fetch(`${API_URL}/api/products`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            throw new Error(`خطا در دریافت محصولات: ${res.status}`);
        }

        const allProducts = await res.json();
        products = allProducts.slice(0, 8);
    } catch (error) {
        console.error('Error in LatestProducts:', error);
        return <LatestProductsError />;
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-blue-50/30 via-white to-indigo-50/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                {/* هدر بخش */}
                <div className="relative mb-12 sm:mb-16">
                    <div className="text-center" data-aos="fade-up" data-aos-once="true" data-aos-delay="100">
                        <span
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100/70 px-5 py-2 rounded-full mb-4 backdrop-blur-sm border border-blue-200/50"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            جدیدترین محصولات
                        </span>

                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3"
                        >
                            محصولات
                            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> پر فروش</span>
                        </h2>

                        <p
                            className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base"
                        >
                            بهترین و محبوب‌ترین محصولات فروشگاه رو با بهترین قیمت تهیه کنید
                        </p>
                    </div>

                    {/* دکمه مشاهده همه */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block"
                    >
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
}