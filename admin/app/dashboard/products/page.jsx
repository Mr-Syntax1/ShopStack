import { Suspense } from 'react';
import ProductsPage from '@/components/products';

function ProductsLoading() {
    return (
        <div className="p-4 md:p-6 lg:p-8 mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 animate-pulse">
                <div className="h-8 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="h-12 bg-gray-100 rounded mb-4" />
                <div className="space-y-3">
                    <div className="h-10 bg-gray-100 rounded" />
                    <div className="h-10 bg-gray-100 rounded" />
                    <div className="h-10 bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsPage />
        </Suspense>
    );
}