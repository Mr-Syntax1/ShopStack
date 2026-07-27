// components/home/CategoriesSection.jsx
import Link from "next/link";
import Container from "../shared/Container";

export default function CategoriesSection() {
    const categoriesData = [
        {
            id: "الکترونیک",
            name: "الکترونیک",
            count: 6,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14M5 17h14M7 7v10M17 7v10M5 7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" />
                </svg>
            ),
        },
        {
            id: "گیمینگ",
            name: "گیمینگ",
            count: 6,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5m0 0V7m0 6H7m5 0h5M3 9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
            ),
        },
        {
            id: "موبایل",
            name: "موبایل",
            count: 3,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            id: "لوازم جانبی",
            name: "لوازم جانبی",
            count: 3,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6-3 6 3v10l-6 3-6-3V7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7l6-3 6 3v10l-6 3-6-3V7z" />
                </svg>
            ),
        },
        {
            id: "پوشیدنی",
            name: "پوشیدنی",
            count: 2,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m4.5 4.5L15 12m0 0l-1.5-1.5M15 12l1.5 1.5M9 9l1.5 1.5M9 9L7.5 7.5M9 9l1.5-1.5M15 15l-1.5 1.5M15 15l1.5-1.5M15 15l-1.5-1.5M9 15l1.5-1.5M9 15l-1.5 1.5M9 15l1.5 1.5" />
                    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            id: "بازی",
            name: "بازی",
            count: 6,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.5-4.5M15 10l-4.5-4.5M15 10l4.5 4.5M15 10l-4.5 4.5M6 6h12M6 18h12M6 6v12M18 6v12" />
                    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            id: "قطعات کامپیوتر",
            name: "قطعات کامپیوتر",
            count: 2,
            svg: (
                <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 16l-2 4h10l-2-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
    ];

    const colors = [
        "from-blue-600 to-indigo-600",
        "from-pink-500 to-rose-500",
        "from-emerald-500 to-green-600",
        "from-amber-500 to-orange-500",
        "from-purple-500 to-violet-600",
        "from-cyan-500 to-blue-600",
        "from-red-500 to-rose-600",
    ];

    return (
        <section className="py-20 lg:py-28 bg-linear-to-b from-white via-blue-50/40 to-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />

            <Container className="relative">
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50/80 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-indigo-100/50">
                        دسته‌بندی‌های پرطرفدار
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        به‌راحتی <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">پیدا کن</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        با دسته‌بندی‌های متنوع ما، دقیقاً همان محصولی که نیاز دارید را پیدا کنید.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoriesData.map((cat, index) => (
                        <Link
                            href={`/products?category=${cat.id}`}
                            key={cat.id}
                            className="group relative overflow-hidden rounded-3xl p-8 h-48 flex flex-col justify-between bg-gradient-to-br from-white/50 to-gray-50/50 border border-white/50 shadow-xl hover:scale-[1.03] transition-all duration-500"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${colors[index % colors.length]} opacity-0 group-hover:opacity-90 transition-opacity duration-500`} />
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    {cat.svg}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-600 group-hover:text-white/80 flex items-center gap-2 text-sm transition-colors duration-500">
                                    {cat.count} محصول
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}