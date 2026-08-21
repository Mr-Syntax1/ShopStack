export default function ProductTableSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 overflow-hidden">

                {/* عنوان با افکت شیشه‌ای */}
                <div className="relative text-center mb-12 sm:mb-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 sm:w-96 sm:h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
                        <div className="w-48 h-48 sm:w-64 sm:h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-20 animate-pulse" />
                    </div>

                    <div className="relative">
                        {/* برچسب دسته‌بندی */}
                        <div className="inline-block w-32 h-7 sm:h-8 bg-gray-200 rounded-full mb-2 sm:mb-3 animate-pulse" />

                        {/* عنوان اصلی */}
                        <div className="flex justify-center mb-2 sm:mb-3">
                            <div className="w-64 h-12 sm:h-14 bg-gray-200 rounded-lg animate-pulse" />
                        </div>

                        {/* تعداد محصولات */}
                        <div className="flex justify-center">
                            <div className="w-48 h-5 bg-gray-200 rounded-md animate-pulse" />
                        </div>

                        {/* خط تزئینی */}
                        <div className="w-16 sm:w-20 md:w-24 h-1 bg-gray-200 mx-auto rounded-full mt-3 sm:mt-4 animate-pulse" />
                    </div>
                </div>

                {/* نوار ابزار (Toolbar) اسکلتون */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-4 sm:p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* جستجو */}
                        <div className="flex-1">
                            <div className="w-full h-11 bg-gray-200 rounded-xl animate-pulse" />
                        </div>

                        {/* دکمه‌های فیلتر و مرتب‌سازی */}
                        <div className="flex flex-wrap gap-2">
                            <div className="w-24 h-11 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="w-24 h-11 bg-gray-200 rounded-xl animate-pulse" />
                            <div className="w-24 h-11 bg-gray-200 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* شبکه محصولات - 4 ستون در دسکتاپ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* تصویر محصول */}
                            <div className="aspect-square bg-gray-200 animate-pulse" />

                            <div className="p-4 space-y-3">
                                {/* عنوان محصول */}
                                <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />

                                {/* برند */}
                                <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-1/2" />

                                {/* قیمت */}
                                <div className="flex items-center justify-between">
                                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/3" />
                                    <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-1/4" />
                                </div>

                                {/* امتیاز و دکمه */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* صفحه‌بندی اسکلتون */}
                <div className="flex justify-between items-center mt-8 pb-8">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"
                                style={{
                                    animationDelay: `${index * 0.05}s`
                                }}
                            />
                        ))}
                    </div>
                    <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}