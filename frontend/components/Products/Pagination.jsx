import { toPersianDigits } from "@/lib/persian";

function getPageNumbers(currentPage, totalPages) {
    const maxVisible = 5;
    const pages = [];

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    }

    if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
    }

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-12 mb-10 px-4">
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                {/* اولین */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="اولین صفحه"
                    className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
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
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="hidden sm:inline">قبلی</span>
                </button>

                {/* شماره صفحات */}
                {pageNumbers.map((pageNum, index) => {
                    if (pageNum === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-9 h-9 flex items-center justify-center text-gray-400 select-none"
                            >
                                &#8230;
                            </span>
                        );
                    }
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            aria-current={currentPage === pageNum ? 'page' : undefined}
                            aria-label={`صفحه ${pageNum}`}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${currentPage === pageNum
                                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600 border border-gray-200'
                                }`}
                        >
                            {toPersianDigits(pageNum)}
                        </button>
                    );
                })}

                {/* بعدی */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="صفحه بعدی"
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                    <span className="hidden sm:inline">بعدی</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* آخرین */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="آخرین صفحه"
                    className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                    آخرین
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}