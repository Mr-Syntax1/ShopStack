'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductToolbar from './ProductToolbar';
// کامپوننت نوار جستجو و فیلترها
import ProductsGrid from './ProductsGrid';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

export default function AllProducts({
    initialProducts = [],
    initialCategory = 'همه',
    initialPage = 1
}) {
    const router = useRouter();// برای تغییر صفحات 
    const searchParams = useSearchParams(); //برای خواندن URL

    const [allProducts, setAllProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(initialProducts.length === 0);
    //اگر محصولات از سرور آمده باشند، نیازی به لودینگ نیست
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || initialCategory
    );
    const [sortBy, setSortBy] = useState('default');
    const [page, setPage] = useState(
        searchParams.get('page') ? parseInt(searchParams.get('page')) : initialPage
    );

    const ppg = 20;

    // دریافت محصولات
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

    // هوک سفارشی برا useCallback
    useEffect(() => {
        if (initialProducts.length === 0) {
            fetchProducts();
        }
    }, [initialProducts, fetchProducts]);

    // تنظیمات جستجو خودکار
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    // گرفتن و ست کردن url
    useEffect(() => {
        const categoryParam = searchParams.get('category') || 'همه';
        const pageParam = parseInt(searchParams.get('page')) || 1;

        if (categoryParam !== selectedCategory) {
            setSelectedCategory(categoryParam);
        }
        if (pageParam !== page) {
            setPage(pageParam);
        }
    }, [searchParams]);

    // اسکرول به بالا
    useEffect(() => {
        if (page > 1 || searchParams.get('page') || searchParams.get('category')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page, selectedCategory]);

    // دسته‌بندی‌ها
    const categories = useMemo(() => {
        const set = new Set();// فقط مقادیر یکتا (Unique) را ذخیره می‌کند
        for (const p of allProducts) {
            if (p.category) set.add(p.category);
        }
        return ['همه', ...set];
    }, [allProducts]);

    // فیلتر و مرتب‌سازی
    const filteredProducts = useMemo(() => {
        let result = allProducts;

        // جستجو
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.brand?.toLowerCase().includes(term) ||
                p.category?.toLowerCase().includes(term) ||
                p.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        }

        // فیلتر دسته‌بندی برای دکمه و یو ار ال
        if (selectedCategory !== 'همه') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // مرتب‌سازی
        switch (sortBy) {
            case 'price-asc':
                // کم به زیاد
                result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-desc':
                // زیاد به کم
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

    // اگر صفحه خارج از محدوده شد، تصحیح کن
    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [totalPages, page]);

    // محصولات صفحه فعلی
    const currentProducts = useMemo(() => {
        const safePage = Math.min(page, totalPages);
        const firstIndex = (safePage - 1) * ppg;
        return filteredProducts.slice(firstIndex, firstIndex + ppg);// محصولات مثلا 0 تا 20
    }, [filteredProducts, page, totalPages]);

    // آپدیت URL
    const updateURL = useCallback((newPage, newCategory) => {
        const params = new URLSearchParams(searchParams.toString());

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
    }, [router, searchParams]);

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

    // لودینگ
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

    // خطا
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    // رندر اصلی
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