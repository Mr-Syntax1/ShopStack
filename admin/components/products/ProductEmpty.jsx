import Link from 'next/link';

const EmptyBoxIcon = () => (
    <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export default function ProductEmpty({ hasFilters, onClearFilters }) {
    return (
        <div className="text-center py-16">
            <div className="mb-4">
                <EmptyBoxIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-600">هیچ محصولی یافت نشد</h3>
            <p className="text-gray-400 mt-2">
                {hasFilters
                    ? 'با فیلترهای اعمال شده محصولی پیدا نشد'
                    : 'اولین محصول خود را اضافه کنید'}
            </p>
            {hasFilters && (
                <button
                    onClick={onClearFilters}
                    className="inline-block mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
                >
                    حذف فیلترها
                </button>
            )}
            {!hasFilters && (
                <Link
                    href="/products/add"
                    className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                    افزودن محصول
                </Link>
            )}
        </div>
    );
}