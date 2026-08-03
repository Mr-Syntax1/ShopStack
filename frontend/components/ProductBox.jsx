import Image from "next/image";
import Link from "next/link";
import { formatPrice } from '../lib/persian';
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast';
import { showSuccessToast } from './CustomToast';

export default function ProductBox({ product, priority = false }) {
    const { addToCart, getDiscountedPrice } = useCart();

    // تابع نمایش توست مدرن
    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast.error('متاسفانه این محصول موجود نیست!');
            return;
        }

        addToCart(product);
        showSuccessToast(product);
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-100/80 hover:border-blue-200/50 max-w-[320px] mx-auto w-full">

            {/* تصویر محصول */}
            <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-white w-full" style={{ height: '250px' }}>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover scale-90 group-hover:scale-100 transition-transform duration-700 ease-out mx-auto"
                    loading={priority ? "eager" : "lazy"}
                    priority={priority}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {product.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                        {product.discount}٪ تخفیف
                    </span>
                )}

                {product.stock === 0 && (
                    <span className="absolute bottom-3 right-3 bg-gray-800/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 backdrop-blur-sm">
                        ناموجود
                    </span>
                )}
            </Link>

            {/* اطلاعات محصول */}
            <div className="p-3 sm:p-4 space-y-2">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-tight hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.2rem]">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-yellow-500">⭐</span>
                        <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                        <span className="text-[10px] text-gray-400">({product.reviews})</span>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {product.discount > 0 ? (
                            <>
                                <span className="text-base sm:text-lg font-bold text-blue-600">
                                    {formatPrice(getDiscountedPrice(product))}
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-base sm:text-lg font-bold text-blue-600">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    <span className="text-[8px] sm:text-[10px] text-gray-400">تومان</span>
                </div>

                {product.stock > 0 ? (
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-1.5 group/btn active:scale-95 cursor-pointer"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>افزودن به سبد</span>
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full py-2 sm:py-2.5 bg-gray-300 text-gray-500 font-semibold text-xs sm:text-sm rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                        <span>ناموجود</span>
                    </button>
                )}
            </div>
        </div>
    );
}