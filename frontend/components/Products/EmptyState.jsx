export default function EmptyState({ onReset }) {
    return (
        <div className="text-center py-20">
            <div className="mb-4">
                <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600">محصولی یافت نشد</h3>
            <p className="text-gray-400 mt-2">سعی کنید با کلمات دیگری جستجو کنید</p>
            <button
                onClick={onReset}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
            >
                نمایش همه محصولات
            </button>
        </div>
    );
}