'use client'
import Image from "next/image";
import Link from "next/link";
import image from './icons/logo.png'

export default function Footer() {

    const quickLinks = [
        { href: '/', label: 'صفحه اصلی' },
        { href: '/products', label: 'محصولات' },
        { href: '/cart', label: 'سبد خرید' },
        { href: '/about', label: 'درباره ما' },
        { href: '/contact', label: 'تماس با ما' },
    ]

    const services = [
        'ارسال رایگان',
        'ضمانت بازگشت کالا',
        'پشتیبانی ۲۴/۷',
        'تضمین کیفیت',
    ]

    return (
        <footer className="relative bg-linear-to-b from-blue-950 via-blue-900 to-blue-800 border-t border-blue-700/50">
            {/* blur effects*/}
            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/10 to-transparent backdrop-blur-md pointer-events-none" />

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* part 1: image and description*/}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-3">
                                <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                                    <Image
                                        src={image}
                                        alt="لوگو"
                                        width={60}
                                        height={60}
                                        className="object-contain w-auto h-auto"
                                    />
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/0 group-hover:ring-blue-500/50 transition-all duration-500" />
                                </div>
                                <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    فروشگاه من
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            ارائه‌دهنده بهترین محصولات با کیفیت بالا و قیمت مناسب.
                            تجربه خریدی لذت‌بخش و مطمئن را با ما داشته باشید.
                        </p>
                    </div>

                    {/* part 2: links*/}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative">
                            لینک‌های سریع
                            <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-linear-to-r from-blue-500 to-blue-600 rounded-full" />
                        </h3>

                        <ul className="space-y-3">
                            {quickLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform duration-300">←</span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* part 3: what we do*/}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative">
                            خدمات ما
                            <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-linear-to-r from-blue-500 to-blue-600 rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <span className="text-green-500 text-sm">✓</span>
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* part 4: contact with us*/}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 relative">
                            ارتباط با ما
                            <span className="absolute -bottom-1 right-0 w-8 h-0.5 bg-linear-to-r from-blue-500 to-blue-600 rounded-full" />
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <p className="flex items-center gap-2">
                                <span className="text-xl">📍</span>
                                تهران، خیابان ولیعصر
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-xl">📞</span>
                                ۰۲۱-۱۲۳۴-۵۶۷۸
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-xl">✉️</span>
                                info@myshop.com
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-xl">🕐</span>
                                شنبه تا پنجشنبه ۹-۲۰
                            </p>
                        </div>
                    </div>
                </div>


                {/* button for going up*/}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center"
                    aria-label="بازگشت به بالا"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </div>
        </footer>
    )
}