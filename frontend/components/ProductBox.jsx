import Image from "next/image";
import Link from "next/link";
import { formatPrice } from '../lib/persian';
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast';
import { showAddToCartToast } from './CustomToast';

export default function ProductBox({ product, priority = false }) {
    const { addToCart, getDiscountedPrice } = useCart();

    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast.error('متاسفانه این محصول موجود نیست!');
            return;
        }

        addToCart(product);
        showAddToCartToast(product);
    };

    return (
        <>
            {/* ===== نسخه موبایل و تبلت (کوچکتر از sm ) - طرح دیجی‌کالا ===== */}
            <div className="sm:hidden group relative bg-white transition-all duration-300 overflow-hidden max-w-[450px] mx-auto w-full my-4 border-b border-b-gray-200/70">
                <Link
                    href={`/products/${product.slug}`}
                    className="flex flex-row items-stretch gap-3.5 p-4"
                >
                    {/* تصویر محصول - سمت راست */}
                    <div className="relative w-32 h-32 flex-shrink-0 bg-white rounded-xl overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-contain"
                            loading={priority ? "eager" : "lazy"}
                            priority={priority}
                            sizes="128px"
                        />
                        {/* {product.discount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                                {product.discount}٪
                            </span>
                        )} */}
                    </div>

                    {/* اطلاعات محصول - سمت چپ */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 min-h-[8rem]">
                        {/* عنوان */}
                        <h3 className="font-bold text-gray-800 hover:text-blue-600 transition-colors text-sm leading-6 line-clamp-2 min-h-[3rem]">
                            {product.title}
                        </h3>

                        {/* دسته‌بندی و امتیاز */}
                        <div className="flex items-center justify-between mt-1.5">
                            {/* سمت چپ: درصد تخفیف */}
                            {product.discount > 0 && product.stock > 0 && (
                                <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-xl">
                                    {product.discount}٪
                                </span>
                            )}

                            {/* سمت راست: امتیاز */}
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-yellow-500">⭐</span>
                                <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                                <span className="text-[10px] text-gray-400">({product.reviews})</span>
                            </div>
                        </div>

                        {/* قیمت و موجودی */}
                        <div className="mt-2">
                            {product.stock === 0 ? (
                                <span className="text-xs font-bold text-red-500">ناموجود</span>
                            ) : (
                                <div className="flex flex-col items-end">
                                    {product.discount > 0 ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[11px] text-gray-400 line-through">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-base font-bold text-blue-700">
                                                {formatPrice(getDiscountedPrice(product))}
                                            </span>
                                            <span className="text-[10px] text-gray-500">تومان</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span className="text-base font-bold text-blue-700">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-[10px] text-gray-500">تومان</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>

            {/* ===== نسخه دسکتاپ (sm به بالا) - همان کد قبلی ===== */}
            <div className="hidden sm:block group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-gray-100/80 hover:border-blue-200/50 md:max-w-[320px] mx-auto w-full my-1">
                <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-white w-full" style={{ height: '250px' }}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-700 ease-out mx-auto"
                        loading={priority ? "eager" : "lazy"}
                        priority={priority}
                        sizes="(max-width: 1024px) 50vw, 25vw"
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

                <div className="p-4 space-y-2">
                    <Link href={`/products/${product.slug}`}>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.2rem]">
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
                                    <span className="text-lg font-bold text-blue-600">
                                        {formatPrice(getDiscountedPrice(product))}
                                    </span>
                                    <span className="text-xs text-gray-400 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg font-bold text-blue-600">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] text-gray-400">تومان</span>
                    </div>

                    {product.stock > 0 ? (
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-1.5 group/btn active:scale-95 cursor-pointer"
                        >
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>افزودن به سبد</span>
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full py-2.5 bg-gray-300 text-gray-500 font-semibold text-sm rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                            <span>ناموجود</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}