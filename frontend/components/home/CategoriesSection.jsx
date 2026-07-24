// components/home/CategoriesSection.jsx

import Link from "next/link";
import Container from "../shared/Container";

export default function CategoriesSection() {
    const categoriesData = [
        {
            id: 1,
            name: "موبایل و تبلت",
            count: 124,
            linear: "from-blue-600 to-indigo-600",
            svg: (
                <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            id: 2,
            name: "مد و پوشاک",
            count: 356,
            linear: "from-pink-500 to-rose-500",
            svg: (
                <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6-3 6 3v10l-6 3-6-3V7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7l6-3 6 3v10l-6 3-6-3V7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10v4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10v4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10" />
                </svg>
            ),
        },
        {
            id: 3,
            name: "لوازم خانگی",
            count: 87,
            linear: "from-emerald-500 to-green-600",
            svg: (
                <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3m6-6v3m0 0h-3m3 0l-3 3m6 0h3m-3 0l3 3m-3-3V9m0 6v3" />
                    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
                </svg>
            ),
        },
        {
            id: 4,
            name: "زیبایی و سلامت",
            count: 92,
            linear: "from-amber-500 to-orange-500",
            svg: (
                <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8M16 8l-8 8" />
                </svg>
            ),
        },
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
                    {categoriesData.map((cat) => (
                        <Link
                            href={`/products?category=${cat.id}`}
                            key={cat.id}
                            className="group relative overflow-hidden rounded-3xl p-8 h-64 flex flex-col justify-between bg-linear-to-br from-white/50 to-gray-50/50 border border-white/50 shadow-xl hover:scale-[1.03] transition-all duration-500"
                        >
                            <div className={`absolute inset-0 bg-linear-to-br ${cat.linear} opacity-0 group-hover:opacity-90 transition-opacity duration-500`} />
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    {cat.svg}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-1">
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