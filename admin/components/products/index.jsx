'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import ProductHeader from './ProductHeader';
import ProductFilters from './ProductFilters';
import ProductTable from './ProductTable';
import ProductEmpty from './ProductEmpty';
import ProductPagination from './ProductPagination';

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // فیلترها
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1,
        limit: 10,
    });

    // دریافت دسته‌بندی‌ها
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
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

    // دریافت محصولات با فیلترها
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search: filters.search,
                category: filters.category,
                sort: filters.sort,
                page: filters.page,
                limit: filters.limit,
            });

            const res = await fetch(`/api/products?${params}`);
            if (!res.ok) throw new Error('خطا در دریافت محصولات');

            const data = await res.json();

            if (data.products) {
                setProducts(data.products);
                setTotalProducts(data.total || data.products.length);
                setTotalPages(data.totalPages || 1);
            } else {
                setProducts(data);
                setTotalProducts(data.length);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('خطا در دریافت محصولات');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
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

        router.push(`/products?${params.toString()}`);
    };

    // جستجو با دیبونس
    const debouncedSearch = useCallback(
        debounce((value) => {
            updateFilters({ search: value, page: 1 });
        }, 500),
        []
    );

    // handleDelete
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

    // بارگذاری
    if (loading && products.length === 0) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-center min-h-[400px] ">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-gray-500">در حال بارگذاری محصولات...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 mt-6 lg:mt-0">
            <ProductHeader totalProducts={totalProducts} />

            <ProductFilters
                filters={filters}
                categories={categories}
                onSearch={debouncedSearch}
                onFilterChange={updateFilters}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <ProductTable
                    products={products}
                    onDelete={handleDelete}
                />

                {products.length === 0 && !loading && (
                    <ProductEmpty
                        hasFilters={!!(filters.search || filters.category)}
                        onClearFilters={() => {
                            updateFilters({ search: '', category: '', page: 1 });
                            document.querySelector('input[type="text"]').value = '';
                        }}
                    />
                )}

                {totalPages > 1 && (
                    <ProductPagination
                        currentPage={filters.page}
                        totalPages={totalPages}
                        totalProducts={totalProducts}
                        limit={filters.limit}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}