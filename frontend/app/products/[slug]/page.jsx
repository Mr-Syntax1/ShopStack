import { generateProductMetadata } from "@/metadata/products";
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { formatPrice } from '../../../lib/persian';
import AddToCartButton from "@/components/AddToCartButton";
import ShareButton from "@/components/productDetail/ShareButton";

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

// برای ارسال دیتای اسلاگ به generateProductMetadata
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    try {
        const res = await fetch(`${API_URL}/api/products/${decodedSlug}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return {
                title: "محصول یافت نشد | OnlineShop",
                description: "محصول مورد نظر شما یافت نشد.",
            };
        }

        const product = await res.json();
        return generateProductMetadata(product); // استفاده از تابع ایمپورت شده

    } catch (error) {
        return {
            title: "خطا | OnlineShop",
            description: "مشکلی در دریافت اطلاعات محصول پیش آمده است.",
        };
    }
}

export default async function ProductDetail({ params }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const res = await fetch(`${API_URL}/api/products/${decodedSlug}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        notFound();
    }

    const product = await res.json();

    const relatedRes = await fetch(`${API_URL}/api/products/related/${decodedSlug}`, {
        cache: 'no-store'
    });
    const relatedProducts = relatedRes.ok ? shuffleArray(await relatedRes.json()).slice(0, 4) : [];

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

                    <Link href={`/products?category=${product.category}`} className="hover:text-blue-400 transition-colors">{product.category}</Link>

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
                                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
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
                                {/* <span className="inline-block text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-1 rounded-full">
                                    {product.brand}
                                </span> */}

                                <Link
                                    href={`/products?category=${product.category}`}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 rounded-full border border-indigo-200/50 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                                    <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {product.category}
                                </Link>

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

                                <span className="text-xs sm:text-sm text-gray-500">
                                    {product.rating} از 5
                                </span>

                                <span className="text-xs sm:text-sm text-gray-400 hidden xs:inline">
                                    |
                                </span>

                                <span className="text-xs sm:text-sm text-gray-500 hidden xs:inline">
                                    {product.reviews} نظر
                                </span>

                                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">
                                    |
                                </span>

                                <span className="text-xs sm:text-sm text-green-600 font-medium hidden sm:inline"
                                >موجودی: {product.stock} عدد
                                </span>
                            </div>

                            {/* قیمت */}
                            <div className="flex flex-col items-start gap-1 sm:gap-2 mb-4 sm:mb-6">
                                {product.discount > 0 ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm sm:text-base text-gray-400 line-through">
                                                {formatPrice(product.price)}
                                            </span>

                                            <span className="text-xs sm:text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 sm:py-1 rounded-full">
                                                -{Math.round((product.price - discountedPrice) / product.price * 100)}%
                                            </span>

                                        </div>

                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                                                {formatPrice(discountedPrice)}
                                            </span>

                                            <span className="text-xs sm:text-sm text-gray-400 mb-1">تومان</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                                            {formatPrice(product.price)}
                                        </span>

                                        <span className="text-xs sm:text-sm text-gray-400 mb-1">تومان</span>
                                    </div>
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
                                <AddToCartButton product={product} />

                                <ShareButton />
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
                            {relatedProducts.map((item, index) => (
                                <Link
                                    key={item._id || item.id || index}
                                    href={`/products/${item.slug}`}
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