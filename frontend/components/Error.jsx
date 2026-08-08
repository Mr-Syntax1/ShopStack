// components/Error.jsx
import Link from "next/link";

export default function Error({
    error,
    onRetry,
    title = 'مشکلی پیش آمده!',
    showHomeButton = true,
    fullScreen = true
}) {
    const Wrapper = fullScreen ? 'div' : 'div';
    const className = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50/30 via-white to-indigo-50/30'
        : 'flex items-center justify-center py-20';

    return (
        <div className={className}>
            <div className="text-center max-w-md mx-auto px-6">
                {/* آیکون خطا */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-linear-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
                    <div className="relative w-32 h-32 mx-auto bg-linear-to-br from-red-50/80 to-orange-50/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-xl shadow-red-500/10 animate-bounce-slow">
                        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                {/* متن */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">{error}</p>

                {/* دکمه‌ها */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>تلاش مجدد</span>
                        </button>
                    )}

                    {showHomeButton && (
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>بازگشت به خانه</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}