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
                    <div key={product._id}>
                        <ProductBox
                            product={product}
                            priority={index < 4}  // ۴ محصول اول با الویت زیاد باز کن
                        />
                    </div>
                ))}
            </div>

        </div>
    );
}