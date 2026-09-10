// components/home/CategoriesSection.jsx
import Link from "next/link";
import Container from "../shared/Container";
import { categoriesData } from "@/data/CategoiesData";

export default function CategoriesSection() {
    return (
        <section className="py-20 lg:py-28 bg-linear-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-200/10 rounded-full blur-2xl" />

            <Container className="relative">
                {/* Header */}
                <div className="text-center mb-16 relative" data-aos="fade-up" data-aos-once="true" data-aos-delay="100">
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
                        <div
                            key={cat.id}
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-once="true"
                            data-aos-delay={index * 100}
                        >
                            <Link
                                href={`/products?category=${cat.id}`}
                                className="group relative overflow-hidden rounded-3xl p-8 h-52 flex flex-col justify-between bg-white/80 border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out will-change-transform"
                            >
                                {/* گرادیان فقط روی هاور */}
                                <div className={`absolute inset-0 bg-linear-to-br ${cat.linear} opacity-0 group-hover:opacity-95 transition-opacity duration-500 ease-out`} />

                                {/* Glow Effect */}
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

                                {/* Icon Container */}
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-white/30 to-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
                                        {cat.svg}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-500 ease-out mb-1">
                                        {cat.name}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 group-hover:text-white/80 text-sm transition-colors duration-500 ease-out">
                                            {cat.subtitle}
                                        </span>

                                        <svg
                                            className="w-4 h-4 text-gray-400 group-hover:text-white/80 group-hover:translate-x-1 transition-transform duration-500 ease-out"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}