export default function ProductToolbar({
    searchInput,
    onSearchChange,
    selectedCategory,
    categories,
    onCategoryChange,
    sortBy,
    onSortChange
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* جستجو */}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="جستجوی محصولات..."
                            value={searchInput}
                            onChange={(e) => onSearchChange(e.target.value)}
                            aria-label="جستجوی محصولات"
                            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* فیلترها */}
                <div className="flex flex-wrap gap-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        aria-label="فیلتر دسته‌بندی"
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        aria-label="مرتب‌سازی"
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                    >
                        <option value="default">پیش‌فرض</option>
                        <option value="price-asc">قیمت: کم به زیاد</option>
                        <option value="price-desc">قیمت: زیاد به کم</option>
                        <option value="rating">امتیاز</option>
                        <option value="discount">بیشترین تخفیف</option>
                    </select>
                </div>
            </div>
        </div>
    );
}