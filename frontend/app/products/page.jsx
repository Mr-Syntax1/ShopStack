'use client'
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductBox from '../../components/ProductBox';

export default function ProductsPage({ params }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('همه');
    const [sortBy, setSortBy] = useState('default');

    const ppg = 20; // محصولات هر صفحه

    // گرفتن دیتا
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('خطا:', error);
                setLoading(false);
            });
    }, []);

    // دسته‌بندی‌ها
    const categories = useMemo(() => {
        return ['همه', ...new Set(allProducts.map(p => p.category))];
    }, [allProducts]);

    // فیلتر و مرتب‌سازی
    const filteredProducts = useMemo(() => {
        let result = allProducts;

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.brand.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        }

        if (selectedCategory !== 'همه') {
            result = result.filter(p => p.category === selectedCategory);
        }

        switch (sortBy) {
            case 'price-asc':
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result = [...result].sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                result = [...result].sort((a, b) => b.discount - a.discount);
                break;
            default:
                result = [...result].sort((a, b) => a.id - b.id);
        }

        return result;
    }, [allProducts, searchTerm, selectedCategory, sortBy]);

    // محصولات صفحه فعلی
    const firstIndex = (page - 1) * ppg;
    const endIndex = firstIndex + ppg;
    const currentProducts = filteredProducts.slice(firstIndex, endIndex);

    // تعداد کل صفحات
    const totalPages = Math.ceil(filteredProducts.length / ppg);

    // تغییر صفحه
    const goToPage = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        router.push(`/products?${params.toString()}`);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    // وقتی فیلتر عوض میشه، برو صفحه اول
    useEffect(() => {
        if (searchTerm || selectedCategory !== 'همه' || sortBy !== 'default') {
            const params = new URLSearchParams(searchParams);
            params.delete('page');
            router.push(`/products?${params.toString()}`);
        }
    }, [searchTerm, selectedCategory, sortBy]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">در حال بارگذاری ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">

                {/* عنوان صفحه */}
                <div className="mb-8 sm:mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
                        همه محصولات
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {filteredProducts.length} محصول از {allProducts.length} محصول موجود
                    </p>
                </div>

                {/* نوار جستجو و فیلتر */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="جستجوی محصولات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                            >
                                <option value="default">پیش‌فرض</option>
                                <option value="price-asc">قیمت: کم به زیاد</option>
                                <option value="price-desc">قیمت: زیاد به کم</option>
                                <option value="rating">امتیاز</option>
                                <option value="discount">بیشترین تخفیف</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* لیست محصولات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {currentProducts.map((product, index) => (
                        <ProductBox
                            key={product._id}
                            product={product}
                            priority={index < 4}
                        />
                    ))}
                </div>

                {/* پیام خالی */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="mb-4">
                            <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-600">محصولی یافت نشد</h3>
                        <p className="text-gray-400 mt-2">سعی کنید با کلمات دیگری جستجو کنید</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('همه');
                            }}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            نمایش همه محصولات
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <button
                            onClick={() => goToPage(1)}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                            اولین
                        </button>

                        <button
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                        >
                            قبلی
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                }

                                else if (page <= 3) {
                                    pageNum = i + 1;
                                }

                                else if (page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                }

                                else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${page === pageNum
                                            ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                        >
                            بعدی
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={() => goToPage(totalPages)}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                        >
                            آخرین
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}