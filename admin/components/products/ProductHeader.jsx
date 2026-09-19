import Link from 'next/link';
import { useAdminAccess } from "@/lib/AdminReadOnlyContext";

const AddIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 4v16m8-8H4" />
    </svg>
);

export default function ProductHeader({ totalProducts }) {
    const { isReadOnly } = useAdminAccess();
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    مدیریت محصولات
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {totalProducts.toLocaleString()} محصول در فروشگاه
                </p>
            </div>
            {!isReadOnly && (
                <Link
                    href="/dashboard/products/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <AddIcon />
                    افزودن محصول
                </Link>
            )}
        </div>
    );
}