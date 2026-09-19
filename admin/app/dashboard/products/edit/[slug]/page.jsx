// app/products/edit/[slug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductForm from '@/components/products/ProductForm';
import Loading from '@/components/Loading';
import ReadOnlyOverlay from '@/components/ReadOnlyOverlay';
import { useAdminAccess } from '@/lib/AdminReadOnlyContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function EditProduct({ params }) {
    const router = useRouter();
    const { isReadOnly } = useAdminAccess();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [product, setProduct] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [slug, setSlug] = useState(null);

    // slug
    useEffect(() => {
        async function getSlug() {
            const { slug } = await params;
            setSlug(slug);
        }
        getSlug();
    }, [params]);

    // ==============================
    // دریافت اطلاعات محصول برای ویرایش
    // ==============================
    useEffect(() => {
        async function fetchProduct() {
            if (!slug) return;

            try {
                setIsLoading(true);
                const res = await fetch(`${API_URL}/api/products/${slug}`);

                if (!res.ok) {
                    if (res.status === 404) {
                        toast.error('محصول یافت نشد');
                        router.push('/dashboard/products');
                        return;
                    }
                    throw new Error('خطا در دریافت محصول');
                }

                const data = await res.json();
                setProduct(data);
                setInitialData(data);

            } catch (error) {
                console.error('Error:', error);
                toast.error('خطا در دریافت اطلاعات محصول');
                router.push('/dashboard/products');
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [slug, router]);

    // ==============================
    // تابع ویرایش محصول
    // ==============================
    const handleSubmit = async (formData) => {
        if (!slug || isReadOnly) return;
        if (isReadOnly) {
            toast.error('این عملیات در حالت فقط خواندنی امکان‌پذیر نیست');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/products/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'خطا در ویرایش محصول');
                return;
            }

            toast.success('محصول با موفقیت ویرایش شد! ✅');
            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error('خطا در ارتباط با سرور');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==============================
    // نمایش لودینگ
    // ==============================
    if (isLoading) {
        return <Loading />
    }

    // ==============================
    // نمایش فرم ویرایش
    // ==============================
    return (
        <div className="p-4 md:p-6 lg:p-8 mt-10 lg:mt-0">
            {isReadOnly && (
                <ReadOnlyOverlay message="ویرایش محصول در حالت فقط خواندنی امکان‌پذیر نیست." />
            )}
            {/* هدر */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        ویرایش محصول
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {product?.title || 'محصول'}
                    </p>
                </div>
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all duration-300 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    بازگشت به لیست
                </Link>
            </div>

            {/* فرم */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                <ProductForm
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                    initialData={initialData}
                    isEdit={true}
                />
            </div>
        </div>
    );
}