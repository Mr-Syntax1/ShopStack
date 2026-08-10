const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function ProductFilters({
    filters,
    categories,
    onSearch,
    onFilterChange
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* جستجو */}
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="جستجوی محصولات..."
                            defaultValue={filters.search}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                {/* دسته‌بندی */}
                <select
                    value={filters.category}
                    onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[140px] text-sm cursor-pointer"
                >
                    <option value="">همه دسته‌ها</option>
                    {categories.map((cat) => (
                        <option key={cat._id || cat.name} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* مرتب‌سازی */}
                <select
                    value={filters.sort}
                    onChange={(e) => onFilterChange({ sort: e.target.value })}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[160px] text-sm cursor-pointer"
                >
                    <option value="newest">جدیدترین</option>
                    <option value="price-asc">قیمت: کم به زیاد</option>
                    <option value="price-desc">قیمت: زیاد به کم</option>
                    <option value="stock-asc">موجودی: کمترین</option>
                    <option value="stock-desc">موجودی: بیشترین</option>
                    <option value="popular">محبوب‌ترین</option>
                    <option value="rating">بالاترین امتیاز</option>
                </select>
            </div>

            {/* فیلترهای فعال */}
            {(filters.search || filters.category) && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                            جستجو: {filters.search}
                            <button
                                onClick={() => {
                                    onFilterChange({ search: '', page: 1 });
                                    document.querySelector('input[type="text"]').value = '';
                                }}
                                className="hover:text-indigo-900 cursor-pointer"
                            >
                                <CloseIcon />
                            </button>
                        </span>
                    )}
                    {filters.category && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {categories.find(c => c.name === filters.category)?.name || filters.category}
                            <button
                                onClick={() => onFilterChange({ category: '', page: 1 })}
                                className="hover:text-blue-900 cursor-pointer"
                            >
                                <CloseIcon />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}