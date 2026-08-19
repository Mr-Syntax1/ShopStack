// components/Loading.jsx
export default function Loading({
    title = 'در حال بارگذاری',
    subtitle = 'لطفاً چند لحظه صبر کنید...',
    fullScreen = true
}) {
    const Wrapper = fullScreen ? 'div' : 'div';
    const className = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50/30 via-white to-indigo-50/30'
        : 'flex items-center justify-center py-20';

    return (
        <div className={className}>
            <div className="text-center">
                {/* لوگوی متحرک با حباب‌ها */}
                <div className="relative w-32 h-32 mx-auto mb-2">
                    {/* حباب‌های پس‌زمینه */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full rounded-full border-4 border-blue-100/30 animate-spin-slow"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 rounded-full border-4 border-indigo-200/40 animate-spin-slow-reverse"></div>
                    </div>

                    {/* آیکون مرکزی */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-blue-500/10 border border-white/20">
                            <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* متن */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{subtitle}</p>

                {/* دات‌های متحرک */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-dot-1"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-dot-2"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-dot-3"></span>
                </div>
            </div>
        </div>
    );
}