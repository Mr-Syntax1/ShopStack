'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductToolbar from './ProductToolbar';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import Error from '../Error';
import ProductTableSkeleton from './ProductTableSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL


export default function AllProducts({
    initialProducts = [],
    initialCategory = 'همه',
    initialPage = 1
}) {
    const router = useRouter();// تغییر مسیر و دریافت اطلاعات مسیر
    const searchParams = useSearchParams();// برای دریافت پارامترهای جستجوی URL

    const searchParamsRef = useRef(searchParams);

    useEffect(() => {
        searchParamsRef.current = searchParams;// چون ref همیشه آخرین مقدار رو داره
    }, [searchParams]);// ذخیره‌ی آخرین مقدار searchParams در یک متغیر

    const [allProducts, setAllProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(initialProducts.length === 0);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || initialCategory
    );
    const [page, setPage] = useState(
        searchParams.get('page') ? parseInt(searchParams.get('page')) : initialPage
    );

    const [sortBy, setSortBy] = useState('newest');

    const ppg = 20;

    const fetchProducts = useCallback(() => {
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/products`)
            .then(res => {
                if (!res.ok) throw new Error('خطا در دریافت اطلاعات');
                return res.json();
            })
            .then(data => {
                setAllProducts(data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('خطا:', err);
                setError('مشکلی در دریافت محصولات پیش آمد.');
                setLoading(false);
            });
    }, []);

    // // اگر محصولات اولیه از سرور نیامده باشند، از API بگیر
    useEffect(() => {
        if (initialProducts.length === 0) {
            // اجرا را به microtask عقب می‌اندازیم تا بدنه افکت مستقیماً setState صدا نزند
            queueMicrotask(() => fetchProducts());
        }
    }, [initialProducts.length, fetchProducts]);

    // // تایمر برای جستجو با تاخیر (debounce) - ۳۰۰ میلی‌ثانیه
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    // // هماهنگ کردن state با URL params (برای پشتیبانی از دکمه‌های عقب/جلو مرورگر)
    useEffect(() => {
        // اجرا را به microtask عقب می‌اندازیم تا بدنه افکت مستقیماً setState صدا نزند
        queueMicrotask(() => {
            const categoryParam = searchParams.get('category') || 'همه';
            const pageParam = parseInt(searchParams.get('page')) || 1;

            // // فقط در صورت تغییر واقعی، state را آپدیت کن (جلوگیری از لوپ)
            if (categoryParam !== selectedCategory) {
                setSelectedCategory(categoryParam);
            }
            if (pageParam !== page) {
                setPage(pageParam);
            }
        });
    }, [searchParams]); // // این افکت فقط وقتی searchParams تغییر می‌کند اجرا می‌شود

    // // اسکرول به بالا هنگام تغییر صفحه یا فیلتر
    useEffect(() => {
        if (page > 1 || searchParams.get('page') || searchParams.get('category')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page, selectedCategory]);

    // // استخراج لیست دسته‌بندی‌های یکتا از محصولات
    const categories = useMemo(() => {
        const categorySet = new Set();
        for (const p of allProducts) {
            if (p.category) categorySet.add(p.category);
        }
        return ['همه', ...categorySet];
    }, [allProducts]);



    // // فیلتر، جستجو و مرتب‌سازی محصولات
    const filteredProducts = useMemo(() => {
        let result = allProducts;

        // // جستجو در عنوان، برند، دسته‌بندی و تگ‌ها
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.brand?.toLowerCase().includes(term) ||
                p.category?.toLowerCase().includes(term) ||
                p.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // // فیلتر بر اساس دسته‌بندی
        if (selectedCategory !== 'همه') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // // مرتب‌سازی
        switch (sortBy) {
            case 'newest':
                result = [...result].sort((a, b) => {
                    // اولویت با updatedAt (برای محصولات جدیدتر)
                    if (a.updatedAt && b.updatedAt) {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                    }
                    // اگر updatedAt نداشت، از createdAt استفاده کن
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    // در غیر این صورت از id استفاده کن
                    return (b.id || 0) - (a.id || 0);
                });
                break;

            case 'price-asc':
                result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'rating':
                result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'discount':
                result = [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            default:
                break;
        }

        return result;
    }, [allProducts, searchTerm, selectedCategory, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ppg));

    // کنترل page ها
    useEffect(() => {
        // اجرا را به microtask عقب می‌اندازیم تا بدنه افکت مستقیماً setState صدا نزند
        queueMicrotask(() => {
            if (!loading && page > totalPages && totalPages > 0) {
                setPage(totalPages);
            }
        });
    }, [totalPages, page, loading]);

    // //  بدست اوردن محصولات صفحه فعلی (با اعتبارسنجی محدوده)
    const currentProducts = useMemo(() => {
        const safePage = Math.min(page, totalPages);
        const firstIndex = (safePage - 1) * ppg;
        return filteredProducts.slice(firstIndex, firstIndex + ppg);
    }, [filteredProducts, page, totalPages]);


    // // آپدیت URL بدون رندر مجدد (برای حفظ scroll position)
    const updateURL = useCallback((newPage, newCategory) => {
        // // استفاده از رفرنس برای دسترسی به آخرین searchParams
        const currentParams = searchParamsRef.current;
        const params = new URLSearchParams(currentParams.toString());

        if (newPage && newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }

        if (newCategory && newCategory !== 'همه') {
            params.set('category', newCategory);
        } else {
            params.delete('category');
        }

        router.replace(`/products?${params.toString()}`, { scroll: false });
    }, [router]);

    const goToPage = useCallback((newPage) => {
        setPage(newPage);
        updateURL(newPage, selectedCategory);
    }, [selectedCategory, updateURL]);

    const handleCategoryChange = useCallback((category) => {
        setSelectedCategory(category);
        setPage(1);
        updateURL(1, category);
    }, [updateURL]);

    const handleSortChange = useCallback((sort) => {
        setSortBy(sort);
        setPage(1);
    }, []);

    const handleSearch = useCallback((term) => {
        setSearchInput(term);
    }, []);

    const handleReset = useCallback(() => {
        setSearchInput('');
        setSearchTerm('');
        handleCategoryChange('همه');
    }, [handleCategoryChange]);

    useEffect(() => {
        if (!loading) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [loading]);

    // نمایش خطا
    if (error) {
        return <Error error={error} onRetry={fetchProducts} />;
    }

    // نمایش لودینگ
    if (loading) {
        return <ProductTableSkeleton />

    }


    // اگر هیچ محصولی وجود نداره و خطا هم نیست ولی loading تموم شده
    if (!loading && !error && allProducts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">محصولی یافت نشد</h3>
                    <p className="text-gray-500">هیچ محصولی در سیستم ثبت نشده است.</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    // // رندر اصلی
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 overflow-hidden">

                {/* عنوان */}
                <div className="relative text-center mb-12 sm:mb-16" data-aos="fade-down" data-aos-once="true">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 sm:w-96 sm:h-96 bg-purple-200/20 rounded-full blur-3xl" />
                        <div className="w-48 h-48 sm:w-64 sm:h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-20" />
                    </div>

                    <div className="relative" data-aos="fade-up" data-aos-once="true" data-aos-delay="100">
                        <span
                            className="inline-block text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50/80 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-2 sm:mb-3 border border-purple-100/50"
                        >
                            {selectedCategory !== 'همه' ? `دسته‌بندی ${selectedCategory}` : 'همه محصولات'}
                        </span>
                        <h1
                            className="text-5xl lg:text-6xl font-bold text-gray-800 mb-2 sm:mb-3"
                        >
                            {selectedCategory !== 'همه' ? (
                                <>
                                    محصولات <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{selectedCategory}</span>
                                </>
                            ) : (
                                <>
                                    همه <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">محصولات</span>
                                </>
                            )}
                        </h1>
                        <p
                            className="text-sm md:text-base text-gray-500"
                        >
                            <span className="font-semibold text-gray-800">{filteredProducts.length}</span> محصول از {' '}
                            <span className="font-semibold text-gray-800">{allProducts.length}</span> محصول موجود
                        </p>
                        <div
                            className="w-16 sm:w-20 md:w-24 h-1 bg-linear-to-r from-purple-600 to-indigo-600 mx-auto rounded-full mt-3 sm:mt-4"
                        />
                    </div>
                </div>

                {/* نوار ابزار */}
                <div data-aos="fade-up" data-aos-delay="100" data-aos-once="true">
                    <ProductToolbar
                        searchInput={searchInput}
                        onSearchChange={handleSearch}
                        selectedCategory={selectedCategory}
                        categories={categories}
                        onCategoryChange={handleCategoryChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                    />
                </div>

                {/* محصولات */}
                {currentProducts.length > 0 ? (
                    <ProductsGrid products={currentProducts} />
                ) : (
                    <EmptyState onReset={handleReset} />
                )}

                {/* صفحه‌بندی */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                />
            </div>
        </div>
    );
}