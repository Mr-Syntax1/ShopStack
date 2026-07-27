export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            for (let i = 1; i <= maxVisible; i++) pages.push(i);
        } else if (currentPage >= totalPages - 2) {
            for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
        } else {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
            {/* اولین */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                aria-label="اولین صفحه"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                اولین
            </button>

            {/* قبلی */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="صفحه قبلی"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
                قبلی
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* شماره صفحات */}
            <div className="flex items-center gap-1 mx-2">
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        aria-label={`صفحه ${pageNum}`}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${currentPage === pageNum
                            ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-105'
                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>

            {/* بعدی */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="صفحه بعدی"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
                بعدی
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* آخرین */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="آخرین صفحه"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
                آخرین
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </button>
        </div>
    );
}