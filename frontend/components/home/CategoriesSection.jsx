// components/home/CategoriesSection.jsx
import Link from "next/link";
import Container from "../shared/Container";
import { categoriesData } from "@/data/CategoiesData";

export default function CategoriesSection() {

    return (
        <section className="py-20 lg:py-28 bg-linear-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-linear-to-r from-indigo-200/20 via-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute top-20 left-10 w-40 h-40 bg-amber-200/10 rounded-full blur-3xl" />

            <Container className="relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block text-sm font-semibold text-indigo-600 bg-linear-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-indigo-100/50 shadow-sm">
                        دسته‌بندی‌های پرطرفدار
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        به‌راحتی <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">پیدا کن</span>
                    </h2>

                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        با دسته‌بندی‌های متنوع ما، دقیقاً همان محصولی که نیاز دارید را پیدا کنید.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoriesData.map((cat, index) => (
                        <Link
                            href={`/products?category=${cat.id}`}
                            key={cat.id}
                            className="group relative overflow-hidden rounded-3xl p-8 h-52 flex flex-col justify-between bg-linear-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                        >
                            {/* Background linear Overlay */}
                            <div className={`absolute inset-0 bg-linear-to-br ${cat.linear} opacity-0 group-hover:opacity-95 transition-opacity duration-500`} />

                            {/* Pattern Background */}
                            <div className={`absolute inset-0 ${cat.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Glow Effects */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            {/* Icon Container */}
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-white/30 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    {cat.svg}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 mb-1">
                                    {cat.name}
                                </h3>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 group-hover:text-white/80 text-sm transition-colors duration-500">
                                        {cat.subtitle}
                                    </span>

                                    <svg
                                        className="w-4 h-4 text-gray-400 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-500" />
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}