'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductForm from '@/components/products/ProductForm';

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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