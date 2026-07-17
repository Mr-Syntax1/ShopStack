'use client'
import Image from "next/image";
import { useEffect } from "react";
import img from '../public/images/4.jpg'
import Link from "next/link";

const HeroSection = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            import('typeit').then((module) => {
                new module.default('.typewriter', {
                    strings: ['معتبر', 'حرفه‌ای', 'مدرن', 'اقتصادی'],
                    speed: 120,
                    deleteSpeed: 80,
                    loop: true,
                    nextStringDelay: 4000,
                    deleteDelay: 500,
                    breakLines: false,
                    cursor: true,
                    cursorChar: '|',
                }).go();
            }).catch(err => console.error('TypeIt loading error:', err));
        }, 100);

        return () => clearTimeout(timer);
    }, []);


    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-12 lg:pt-32">
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl" />

            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <div className="text-center lg:text-right">
                        <h1 className="text-6xl xl:text-7xl font-bold text-gray-800 leading-20 xl:leading-24 mb-8">
                            <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                فروشگاه
                            </span>
                            <span className="block text-gray-700">
                                Online Shop
                            </span>
                            <span className="relative inline-block mt-1">
                                <span className="absolute -bottom-2 left-0 w-full h-3 bg-blue-500/20 -skew-x-12" />
                                <span className="typewriter"></span>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                            فروشگاهی معتبر Online Shop با تنوع گسترده‌ای از محصولات باکیفیت و اصل.
                            خرید آسان، ارسال سریع و پشتیبانی ۲۴ ساعته، تجربه‌ای مطمئن و لذت‌بخش را برای شما به ارمغان می‌آورد.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <Link
                                href="/products"
                                className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">مشاهده محصولات</span>
                                <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>

                            <a
                                href="/about"
                                className="px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-gray-200/50 hover:shadow-gray-300/50 hover:scale-105 border border-gray-200/50"
                            >
                                درباره ما
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-24 xl:gap-36 mt-16 pt-10 border-t border-gray-200/50 mb-15">
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-gray-800">۵۰۰+</p>
                                <p className="text-base sm:text-lg text-gray-500">محصولات</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-gray-800">۱۰۰۰+</p>
                                <p className="text-base sm:text-lg text-gray-500">مشتریان</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl sm:text-4xl font-bold text-gray-800">۹۸%</p>
                                <p className="text-base sm:text-lg text-gray-500">رضایت</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-blue-500/20 rounded-3xl -rotate-3" />
                            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-purple-500/20 rounded-3xl rotate-3" />

                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 transition-all duration-500 hover:shadow-blue-500/30 hover:scale-[1.02]">
                                <Image
                                    src={img}
                                    alt="محصولات فروشگاهی"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    priority
                                />

                                <div className="absolute inset-0 bg-linear-to-tr from-blue-900/10 via-transparent to-purple-900/10" />

                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                                    <p className="text-sm font-semibold text-gray-900">تخفیف ویژه</p>
                                    <p className="text-xs text-gray-500">۲۰٪ تا پایان هفته</p>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl">
                                        🛒
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">ارسال رایگان</p>
                                        <p className="text-xs text-gray-500">سفارش‌های بالای ۵۰۰ هزار</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </section>
    );
}

export default HeroSection;