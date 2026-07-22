'use client'
import Link from "next/link";
import ProductBox from "./ProductBox";

export default function ProductList({ products }) {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-7xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-gray-600">محصولی یافت نشد</h3>
                <p className="text-gray-400 mt-1">لطفاً دوباره تلاش کنید</p>
            </div>
        );
    }

    return (
        <div>
            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {products.map((product, index) => (
                    <div key={product.id}>
                        <ProductBox
                            product={product}
                            priority={index < 4}  // ۴ محصول اول با الویت زیاد باز کن
                        />
                    </div>
                ))}
            </div>

            {/* دکمه مشاهده همه */}
            <div className="mt-10 text-center">
                <Link
                    href="/products"
                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                >
                    مشاهده همه محصولات
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

        </div>
    );
}