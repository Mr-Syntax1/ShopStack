import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { formatPrice } from '../../../lib/persian';

const products = [
    { id: 1, title: 'محصول ۱', price: 12000000, image: '/images/1.jpg', description: 'توضیحات محصول ۱' },

    { id: 2, title: 'محصول ۲', price: 8000000, image: '/images/2.jpg', description: 'توضیحات محصول ۲' },

    { id: 3, title: 'محصول ۳', price: 1500000, image: '/images/3.jpg', description: 'توضیحات محصول ۳' },

    { id: 4, title: 'محصول ۴', price: 3000000, image: '/images/4.jpg', description: 'توضیحات محصول ۴' },
];

export default async function ProductDetail({ params }) {
    const { id } = await params;

    const product = products.find((item) => item.id === parseInt(id));

    if (!product) {
        notFound();
    }

    const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 3);

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50/50 py-8 sm:py-12 lg:py-16 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">

                {/* مسیر (Breadcrumb) */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 sm:mb-8" aria-label="Breadcrumb">
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
                            <div className="relative aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-inner ">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {/* {product.discount && (
                                    <div className="absolute top-4 right-4 bg-linear-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                        {product.discount}٪ تخفیف
                                    </div>
                                )} */}
                            </div>

                            {/* <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button> */}
                        </div>

                        {/* بخش اطلاعات */}
                        <div className="flex flex-col">
                            {/* {product.category && (
                                <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 w-fit">
                                    {product.category}
                                </span>
                            )} */}

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                                {product.title}
                            </h1>
                            {/* 
                            {product.rating && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">({product.rating} از ۵)</span>
                                    <span className="text-sm text-gray-400">|</span>
                                    <span className="text-sm text-gray-500">۱۲۳ نظر</span>
                                </div>
                            )} */}

                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                                    {formatPrice(product.price)}
                                </span>

                                {/* {product.oldPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.oldPrice)}
                                    </span>
                                )} */}
                                <span className="text-sm text-gray-400 mb-1">تومان</span>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6">
                                {product.description || 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.'}
                            </p>

                            {/* {product.features && (
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {product.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="text-green-500">✓</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            )} */}

                            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6 border-t border-gray-100">
                                <button className="flex-1 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    افزودن به سبد خرید
                                </button>
                                <button className="sm:flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    علاقه‌مندی
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* محصولات مرتبط */}
                {relatedProducts.length > 0 && (
                    <div className="mt-6 sm:mt-8 lg:mt-10 px-3 sm:px-4 lg:px-0">
                        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">
                            محصولات مرتبط
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4  mx-auto">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/products/${relatedProduct.id}`}
                                    className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100/80"
                                >
                                    <div className="relative aspect-4/3 sm:aspect-4/3 lg:aspect-4/2 bg-gray-100">
                                        <Image
                                            src={relatedProduct.image}
                                            alt={relatedProduct.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 "
                                        />
                                    </div>
                                    <div className="p-2.5 sm:p-3 lg:p-4">
                                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition text-sm lg:text-base line-clamp-2">
                                            {relatedProduct.title}
                                        </h3>
                                        <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 mt-0.5 sm:mt-1">
                                            {formatPrice(relatedProduct.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>)}
            </div>
        </div>
    );
}