'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductToolbar from './ProductToolbar';
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

export default function AllProducts({
    initialProducts = [],
    initialCategory = 'همه',
    initialPage = 1
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // // استفاده از رفرنس برای جلوگیری از بازنشانی غیرضروری توابع در هر رندر
    // // چون searchParams در هر رندر یک شیء جدید است، از رفرنس برای دسترسی به آخرین مقدار استفاده می‌کنیم
    const searchParamsRef = useRef(searchParams);
    searchParamsRef.current = searchParams;

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
    const [sortBy, setSortBy] = useState('default');

    const ppg = 20;

    // // دریافت همه محصولات از API (فقط زمانی که initialProducts خالی باشد)
    const fetchProducts = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch('/api/products')
            .then(res => {
                if (!res.ok) throw new Error('خطا در دریافت اطلاعات');
                return res.json();
            })
            .then(data => {
                setAllProducts(data);
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
            fetchProducts();
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
        const categoryParam = searchParams.get('category') || 'همه';
        const pageParam = parseInt(searchParams.get('page')) || 1;

        // // فقط در صورت تغییر واقعی، state را آپدیت کن (جلوگیری از لوپ)
        if (categoryParam !== selectedCategory) {
            setSelectedCategory(categoryParam);
        }
        if (pageParam !== page) {
            setPage(pageParam);
        }
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

    // // تصحیح خودکار شماره صفحه اگر خارج از محدوده باشد
    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        }
    }, [totalPages, page]);

    // // محصولات صفحه فعلی (با اعتبارسنجی محدوده)
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

    // // نمایش لودینگ
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

    // // نمایش خطا
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl transition-all hover:bg-indigo-700 cursor-pointer"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    // // رندر اصلی
    return (
        <div className="min-h-screen bg-gray-50/50 py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">

                {/* عنوان */}
                <div className="mb-8 sm:mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 ">
                        {selectedCategory !== 'همه' ? `محصولات ${selectedCategory}` : 'همه محصولات'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {filteredProducts.length} محصول از {allProducts.length} محصول موجود
                    </p>
                </div>

                {/* نوار ابزار */}
                <ProductToolbar
                    searchInput={searchInput}
                    onSearchChange={handleSearch}
                    selectedCategory={selectedCategory}
                    categories={categories}
                    onCategoryChange={handleCategoryChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                />

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
