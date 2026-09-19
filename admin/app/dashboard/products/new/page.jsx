'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductForm from '@/components/products/ProductForm';
import ReadOnlyOverlay from '@/components/ReadOnlyOverlay';
import { useAdminAccess } from "@/lib/AdminReadOnlyContext";

export default function NewProductPage() {
    const router = useRouter();
    const { isReadOnly } = useAdminAccess();
    const [isLoading, setIsLoading] = useState(false);

    if (isReadOnly) {
        return (
            <div className="p-4 md:p-6 lg:p-8 mt-10 lg:mt-0">
                <ReadOnlyOverlay message="افزودن محصول جدید در حالت فقط خواندنی امکان‌پذیر نیست." />
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8 text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">فقط خواندنی</h2>
                        <p className="text-gray-500 mb-6">در این محیط امکان افزودن محصول جدید وجود ندارد.</p>
                        <Link
                            href="/dashboard/products"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                            بازگشت به لیست محصولات
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'خطا در افزودن محصول');
                return;
            }

            toast.success('محصول با موفقیت اضافه شد! ✅');
            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error('خطا در ارتباط با سرور');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 mt-10 lg:mt-0">
            {/* هدر */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        افزودن محصول جدید
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        اطلاعات محصول را وارد کنید
                    </p>
                </div>
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all duration-300 cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    بازگشت به لیست
                </Link>
            </div>

            {/* فرم */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
                <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
}