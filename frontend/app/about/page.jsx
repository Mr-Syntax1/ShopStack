import Link from "next/link";

export const metadata = {
    title: "درباره ما | OnlineShop",
    description: "آشنایی با OnlineShop، تاریخچه، تیم، افتخارات و ارزش‌های ما",
};

export default function AboutPage() {
    const stats = [
        {
            value: "۵۰,۰۰۰+",
            label: "محصولات فروخته شده",
            linear: "from-blue-500 to-cyan-500",
            svg: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            value: "۵۰,۰۰۰+",
            label: "مشتریان راضی",
            linear: "from-purple-600 to-pink-600",
            svg: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
            ),
        },
        {
            value: "۴.۸",
            label: "میانگین امتیاز",
            linear: "from-amber-400 to-orange-400",
            svg: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
        },
        {
            value: "۱۰+",
            label: "جوایز کسب شده",
            linear: "from-rose-500 to-red-500",
            svg: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
    ];

    const values = [
        {
            title: "ضمانت اصالت کالا",
            description: "همه محصولات اصل با گارانتی معتبر",
            linear: "from-blue-500 to-indigo-500",
            svg: (
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
        {
            title: "ارسال سریع",
            description: "ارسال به تمام نقاط کشور در ۲۴ ساعت",
            linear: "from-cyan-500 to-blue-500",
            svg: (
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
            ),
        },
        {
            title: "بهترین قیمت",
            description: "تضمین بهترین قیمت در بازار",
            linear: "from-amber-500 to-orange-500",
            svg: (
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const team = [
        {
            name: "علی محمدی",
            role: "مدیرعامل و بنیان‌گذار",
            bio: "بیش از ۱۰ سال تجربه در حوزه تجارت الکترونیک",
            linear: "from-purple-600 to-indigo-600",
            icon: (
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            name: "سارا احمدی",
            role: "مدیر فنی",
            bio: "متخصص توسعه وب و هوش مصنوعی",
            linear: "from-pink-500 to-rose-500",
            icon: (
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
        },
        {
            name: "رضا کریمی",
            role: "مدیر لجستیک",
            bio: "مدیریت زنجیره تامین و ارسال",
            linear: "from-cyan-500 to-blue-500",
            icon: (
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-24 pb-12 sm:pb-16">

                {/* هدر صفحه با افکت */}
                <div className="relative text-center mb-12 sm:mb-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 sm:w-96 sm:h-96 bg-purple-200/20 rounded-full blur-3xl" />
                        <div className="w-48 h-48 sm:w-64 sm:h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-20" />
                    </div>

                    <div className="relative">
                        <span className="inline-block text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50/80 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-purple-100/50">
                            آشنایی با ما
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 sm:mb-4">
                            درباره <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">OnlineShop</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto px-4">
                            داستان، افتخارات و تیمی که پشت موفقیت‌های ما قرار دارند
                        </p>
                        <div className="w-20 sm:w-24 h-1 bg-linear-to-r from-purple-600 to-indigo-600 mx-auto rounded-full mt-3 sm:mt-4" />
                    </div>
                </div>

                {/* داستان ما - طراحی مدرن */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-12 sm:mb-16 border border-gray-100/50">
                    <div className="grid lg:grid-cols-5 gap-0">
                        <div className="lg:col-span-3 p-6 sm:p-8 md:p-10 lg:p-12">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    داستان ما
                                </h2>
                            </div>

                            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                                <p>
                                    OnlineShop در سال ۱۳۹۸ با هدف ارائه بهترین محصولات دیجیتال با بالاترین کیفیت
                                    و مناسب‌ترین قیمت شروع به کار کرد. ما معتقدیم که همه باید به تکنولوژی روز دنیا
                                    دسترسی داشته باشند.
                                </p>
                                <p>
                                    امروز پس از ۵ سال فعالیت مستمر، بیش از ۵۰,۰۰۰ مشتری راضی داریم و جزو
                                    ۱۰ فروشگاه برتر آنلاین کشور هستیم.
                                </p>
                                <p className="font-medium text-purple-600">
                                    هدف ما ایجاد تجربه خریدی لذت‌بخش و مطمئن برای شما عزیزان است.
                                </p>
                            </div>

                            {/* آمار سریع */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">۱۳۹۸</div>
                                    <div className="text-[10px] sm:text-xs text-gray-400">سال تاسیس</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">۵+</div>
                                    <div className="text-[10px] sm:text-xs text-gray-400">سال فعالیت</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">۱۰</div>
                                    <div className="text-[10px] sm:text-xs text-gray-400">فروشگاه برتر</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 sm:p-10 md:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden min-h-[200px] sm:min-h-[250px] lg:min-h-0">
                            <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />

                            <div className="relative text-center">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg border border-white/20">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">چشم‌انداز ما</h3>
                                <p className="text-purple-100 text-base sm:text-lg max-w-sm px-4">
                                    اولین انتخاب شما در خرید آنلاین
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* آمار و ارقام با انیمیشن و SVG */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-4 sm:p-6 text-center overflow-hidden border border-gray-100/50"
                        >
                            <div className={`absolute inset-0 bg-linear-to-br ${stat.linear} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                            <div className="absolute -top-12 -right-12 w-24 sm:w-32 h-24 sm:h-32 bg-gray-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative">
                                <div className={`inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-linear-to-br ${stat.linear} text-white shadow-lg mb-3 sm:mb-4`}>
                                    {stat.svg}
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-0.5 sm:mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] sm:text-sm text-gray-500">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ارزش‌های ما */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 mb-12 sm:mb-16 border border-gray-100/50">
                    <div className="text-center mb-8 sm:mb-12">
                        <span className="inline-block text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50/80 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
                            ارزش‌های ما
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            چه چیزی ما را <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">متمایز</span> کرده
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {values.map((item, index) => (
                            <div
                                key={index}
                                className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-white transition-all duration-500 hover:shadow-lg text-center"
                            >
                                <div className={`inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-linear-to-br ${item.linear} text-white shadow-lg mb-3 sm:mb-4`}>
                                    {item.svg}
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* تیم ما - طراحی مدرن */}
                <div className="text-center">
                    <div className="mb-8 sm:mb-12">
                        <span className="inline-block text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50/80 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
                            تیم ما
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            افراد <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">کلیدی</span> پشت OnlineShop
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-4 sm:p-6 border border-gray-100/50 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-linear-to-br ${member.linear} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                <div className="relative">
                                    <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-linear-to-br ${member.linear} rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-500`}>
                                        {member.icon}
                                    </div>

                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                        {member.name}
                                    </h3>
                                    <p className={`text-xs sm:text-sm font-medium bg-linear-to-r ${member.linear} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                                        {member.role}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA پایین صفحه */}
                <div className="mt-12 sm:mt-16 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
                            آماده‌اید بهترین تجربه خرید را داشته باشید؟
                        </h2>
                        <p className="text-purple-100 max-w-2xl mx-auto mb-4 sm:mb-6 text-sm sm:text-base px-4">
                            با OnlineShop، خرید آنلاین را به سطح جدیدی ببرید. کیفیت، قیمت و سرعت را یکجا تجربه کنید.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                            <Link
                                href="/products"
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                شروع خرید
                            </Link>
                            <Link
                                href="/contact"
                                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                تماس با ما
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
