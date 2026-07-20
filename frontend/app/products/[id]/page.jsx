import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { formatPrice } from '../../../lib/persian';




// تابع کمکی برای شافل کردن آرایه (تصادفی‌سازی)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default async function ProductDetail({ params }) {

    const res = await fetch('http://localhost:3000/api/products')
    const products = await res.json()
    // دیتای کامل محصولات - از فایل اصلی کپی شده

    const { id } = await params;

    const product = products.find((item) => item.id === parseInt(id));

    if (!product) {
        notFound();
    }

    // محصولات مرتبط از همان دسته - تصادفی
    const relatedProducts = shuffleArray(
        products.filter((item) => item.id !== product.id && item.category === product.category)
    ).slice(0, 4);

    // محاسبه قیمت با تخفیف
    const discountedPrice = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50/50 py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">

                {/* مسیر (Breadcrumb) */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 sm:mb-8">
                    <Link href="/" className="hover:text-blue-600 transition-colors">خانه</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href="/products" className="hover:text-blue-600 transition-colors">محصولات</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-700 font-medium truncate">{product.title}</span>
                </nav>

                {/* کارت اصلی محصول */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100/80">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8">

                        {/* بخش تصویر */}
                        <div className="relative">
                            <div className="relative aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {product.discount > 0 && (
                                    <div className="absolute top-4 right-4 bg-linear-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                        {product.discount}% تخفیف
                                    </div>
                                )}
                                {product.stock < 5 && product.stock > 0 && (
                                    <div className="absolute bottom-4 right-4 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                        تنها {product.stock} عدد
                                    </div>
                                )}
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl px-6 py-3 bg-red-500/80 rounded-xl rotate-[-15deg] border-2 border-white/30">
                                            ناموجود
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* بخش اطلاعات */}
                        <div className="flex flex-col">
                            {/* برند و دسته‌بندی */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                                <span className="inline-block text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-1 rounded-full">
                                    {product.brand}
                                </span>
                                <span className="inline-block text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2.5 sm:px-3 py-1 rounded-full">
                                    {product.category}
                                </span>
                                {product.discount > 0 && (
                                    <span className="inline-block text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2.5 sm:px-3 py-1 rounded-full">
                                        {Math.round((product.price - discountedPrice) / product.price * 100)}% تخفیف
                                    </span>
                                )}
                            </div>

                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
                                {product.title}
                            </h1>

                            {/* امتیاز */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500">{product.rating} از 5</span>
                                <span className="text-xs sm:text-sm text-gray-400 hidden xs:inline">|</span>
                                <span className="text-xs sm:text-sm text-gray-500 hidden xs:inline">{product.reviews} نظر</span>
                                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">|</span>
                                <span className="text-xs sm:text-sm text-green-600 font-medium hidden sm:inline">موجودی: {product.stock} عدد</span>
                            </div>

                            {/* قیمت */}
                            <div className="flex flex-wrap items-end gap-2 sm:gap-3 mb-4 sm:mb-6">
                                {product.discount > 0 ? (
                                    <>
                                        <span className="text-xs sm:text-sm text-gray-400 mb-1">تومان</span>
                                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                                            {formatPrice(discountedPrice)}
                                        </span>
                                        <span className="text-base sm:text-lg pr-3 text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 sm:py-1 rounded-full">
                                            -{Math.round((product.price - discountedPrice) / product.price * 100)}%
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                                        {formatPrice(product.price)}
                                    </span>
                                )}

                            </div>

                            {/* توضیحات */}
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                                {product.description}
                            </p>

                            {/* تگ‌ها */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                                    {product.tags.map((tag, index) => (
                                        <span key={index} className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* دکمه‌ها */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-4 sm:pt-6 border-t border-gray-100">
                                {product.stock > 0 ? (
                                    <button className="w-full sm:flex-1 py-3 sm:py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>افزودن به سبد خرید</span>
                                    </button>
                                ) : (
                                    <button disabled className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gray-300 text-gray-500 font-semibold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        <span>ناموجود</span>
                                    </button>
                                )}
                                <button className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="hidden xs:inline">افزودن به</span>
                                    <span>علاقه‌مندی</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* محصولات مرتبط */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
                            محصولات مرتبط
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/80"
                                >
                                    <div className="relative aspect-square bg-white overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover scale-95 group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        {item.discount > 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                                {item.discount}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition text-sm line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm font-bold text-blue-600 mt-1">
                                            {formatPrice(
                                                item.discount > 0
                                                    ? Math.round(item.price * (1 - item.discount / 100))
                                                    : item.price
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}