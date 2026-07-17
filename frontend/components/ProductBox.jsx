import Image from "next/image";
import Link from "next/link";
import { formatPrice } from '../lib/persian';

export default function ProductBox({ product }) {
    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-100/80 hover:border-blue-200/50 max-w-[280px] mx-auto w-full">

            {/* تصویر محصول - ارتفاع کمتر */}
            <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-gray-100 w-full" style={{ height: '230px' }}>
                <Image
                    src={`/images/${product.id}.jpg`}
                    alt={product.title}
                    width={280}
                    height={220}
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out w-full h-full"
                />
            </Link>

            {/* اطلاعات محصول */}
            <div className="p-3 sm:p-4 space-y-2">
                {/* عنوان */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-tight hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.2rem]">
                        {product.title}
                    </h3>
                </Link>

                {/* قیمت */}
                <div className="flex items-end justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-blue-600">
                            {formatPrice(product.price)}
                        </span>

                        {/* {product.oldPrice && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )} */}

                    </div>
                    <span className="text-[8px] sm:text-[10px] text-gray-400">تومان</span>
                </div>

                {/* دکمه افزودن به سبد خرید */}

                <button className="w-full py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-1.5 group/btn active:scale-95 cursor-pointer">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>افزودن به سبد</span>
                </button>
            </div>
        </div>
    );
}