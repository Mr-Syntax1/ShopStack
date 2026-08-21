export default function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50/50 py-8 sm:py-12 lg:py-16 animate-pulse">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">

                {/* مسیر (Breadcrumb) - اسکلت */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 sm:mb-8">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>

                {/* کارت اصلی محصول - اسکلت */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100/80">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8">

                        {/* بخش تصویر - اسکلت */}
                        <div className="relative">
                            <div className="relative aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
                                {/* آیکون تصویر */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* بخش اطلاعات - اسکلت */}
                        <div className="flex flex-col space-y-4">

                            {/* برند و دسته‌بندی - اسکلت */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            </div>

                            {/* عنوان - اسکلت */}
                            <div className="space-y-2">
                                <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                                <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
                            </div>

                            {/* امتیاز - اسکلت */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>

                            {/* قیمت - اسکلت */}
                            <div className="flex flex-col items-start gap-1 sm:gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="h-10 bg-gray-200 rounded w-40"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                            </div>

                            {/* توضیحات - اسکلت */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>

                            {/* تگ‌ها - اسکلت */}
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-6 bg-gray-200 rounded-full w-16"></div>
                                ))}
                            </div>

                            {/* دکمه‌ها - اسکلت */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-4 sm:pt-6 border-t border-gray-100">
                                <div className="w-full sm:flex-1 h-12 bg-gray-200 rounded-2xl"></div>
                                <div className="w-full sm:flex-1 h-12 bg-gray-200 rounded-2xl"></div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* محصولات مرتبط - اسکلت */}
                <div className="mt-12 sm:mt-16">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6 sm:mb-8"></div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/80">
                                <div className="relative aspect-square bg-gray-200"></div>
                                <div className="p-3 sm:p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}