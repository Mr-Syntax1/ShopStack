'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import ProductHeader from './ProductHeader';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import ProductEmpty from './ProductEmpty';
import ProductPagination from './ProductPagination';
import ErrorState from './ErrorState';
import ProductTableSkeleton from '../ProductTableSkeleton';// برای loading

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // فیلترها و گرفتن کوعری ها
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1,
        limit: 15,
    });

    // دریافت دسته‌بندی‌ها
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_URL}/api/categories`, {
                    next: { revalidate: 10 }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // ===================================
    // دریافت محصولات با فیلترها
    // ===================================
    const fetchProducts = useCallback(async () => {
        setError(null);

        // تشخیص بارگذاری اولیه یا تغییر
        if (products.length === 0) {
            setLoading(true);
        } else {
            setIsChanging(true);
        }

        try {
            const params = new URLSearchParams({
                search: filters.search,
                category: filters.category,
                sort: filters.sort,
                page: filters.page,
                limit: filters.limit,
            });

            // استراتژی کش
            let cacheOption = {};

            if (filters.search || filters.category) {
                cacheOption = { cache: 'no-store' };
            }

            else if (filters.sort === 'newest' && filters.page === 1) {
                cacheOption = { next: { revalidate: 10 } };
            }

            else {
                cacheOption = { cache: 'no-store' };
            }

            const res = await fetch(`${API_URL}/api/products?${params}`, {
                ...cacheOption
            });

            if (!res.ok) {
                if (res.status === 500) {
                    throw new Error('خطای سرور (۵۰۰)');
                } else {
                    throw new Error(`خطا: ${res.status}`);
                }
            }

            const data = await res.json();

            setProducts(data.products);
            setTotalProducts(data.total || data.products.length);
            setTotalPages(data.totalPages || 1);


        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'خطا در دریافت محصولات');
        } finally {
            setLoading(false);
            setIsChanging(false);
        }
    }, [filters, products.length]);

    useEffect(() => {
        // اجرای فچ را به microtask عقب می‌اندازیم تا بدنه افکت مستقیماً setState صدا نزند
        let active = true;
        queueMicrotask(() => {
            if (active) fetchProducts();
        });
        return () => { active = false; };
    }, [fetchProducts]);

    // به‌روزرسانی URL با فیلترها
    const updateFilters = (newFilters) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);

        const params = new URLSearchParams();
        if (updated.search) params.set('search', updated.search);
        if (updated.category) params.set('category', updated.category);
        if (updated.sort) params.set('sort', updated.sort);
        if (updated.page > 1) params.set('page', updated.page);

        // تغییر مسیر
        router.push(`/dashboard/products?${params.toString()}`);
    };

    // ===========================================================

    // جستجو با دیبونس
    const debouncedSearch = useMemo(() =>
        debounce((value) => {
            updateFilters({
                search: value,
                page: 1,
                category: filters.category
            });
        }, 700),
        [filters.category]
    );

    // حذف product
    const handleDelete = (productSlug) => {
        setProducts(prev => prev.filter(p => p.slug !== productSlug));
        setTotalProducts(prev => prev - 1);
    };

    // تغییر صفحه
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateFilters({ page: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // تلاش مجدد
    const handleRetry = () => {
        setError(null);
        fetchProducts();
    };

    // پاک‌کننده فیلترها
    const handleClearFilters = () => {
        updateFilters({ search: '', category: '', page: 1 });
        const input = document.querySelector('input[type="text"]');
        if (input) input.value = '';
    };

    // ===================================
    // نمایش خطا
    // ===================================
    if (error) {
        return (
            <div className="p-4 md:p-6 lg:p-8 mt-6 lg:mt-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                    <ErrorState
                        error={error}
                        onRetry={handleRetry}
                    />
                </div>
            </div>
        );
    }

    // ===================================
    // رندر اصلی
    // ===================================
    return (
        <div className="p-4 md:p-6 lg:p-8 mt-6 lg:mt-0">
            <ProductHeader totalProducts={totalProducts} />

            <ProductFilters
                filters={filters}
                categories={categories}
                onSearch={debouncedSearch}
                onFilterChange={updateFilters}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden relative">

                {/* اسکلت برای بارگذاری اولیه */}
                {loading && products.length === 0 && (
                    <ProductTableSkeleton />
                )}

                {/* محتوای اصلی */}
                {!loading && (
                    <>
                        <ProductTable
                            products={products}
                            onDelete={handleDelete}
                        />

                        {/* نمایش خالی */}
                        {products.length === 0 && !error && (
                            <ProductEmpty
                                hasFilters={!!(filters.search || filters.category)}
                                // اگه یکیشون باشه دکمه حذف فیلتر ها  رو نشون میده
                                // اگه هر دو نباشن دکمه افزودن محصول رو نشون میده
                                onClearFilters={handleClearFilters}
                            />
                        )}

                        {/* صفحه‌بندی */}
                        {totalPages > 1 && (
                            <ProductPagination
                                currentPage={filters.page}
                                totalPages={totalPages}
                                totalProducts={totalProducts}
                                limit={filters.limit}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}

                {/*  اوورلی لودینگ برای تغییرات (سرچ، فیلتر، صفحه) */}
                {isChanging && products.length > 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <div className="bg-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-gray-200">
                            <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="text-gray-700 font-medium">در حال بروزرسانی...</span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}