'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from './icons/logo2.png'
import { formatPrice } from "../lib/persian";

export default function Header() {
    const [isOpenHamburger, setIsOpenHamburger] = useState(false)

    return (
        <header className="bg-white/30 backdrop-blur-xl text-black shadow-lg fixed w-full top-0 z-50 font-sans text-sm border-b border-white/20">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">

                {/* logo */}
                <Link href="/" className="shrink-0">
                    <Image
                        src={logo}
                        alt="logo"
                        width={96}
                        height={96}
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* desktop menu */}
                <nav className="hidden md:flex items-center gap-8 font-semibold ">
                    <Link href="/"
                        className="hover:text-blue-600 transition"
                    >
                        صفحه اصلی
                    </Link>

                    <Link href="/products" className="hover:text-blue-600 transition"
                    >
                        محصولات
                    </Link>

                    <Link href="/about"
                        className="hover:text-blue-600 transition"
                    >
                        درباره ما
                    </Link>

                    <Link href="/contact"
                        className="hover:text-blue-600 transition"
                    >
                        تماس با ما
                    </Link>

                </nav>

                {/* buttons = cart and humburger*/}
                <div className="flex items-center gap-2">
                    {/* cart icon*/}
                    <Link
                        href="/cart"
                        className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition relative "
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>

                        {/* counter */}
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {formatPrice(3)}
                        </span>
                    </Link>

                    {/* hamburger button */}
                    <button
                        onClick={() => setIsOpenHamburger(!isOpenHamburger)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition relative z-50 cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpenHamburger ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* mobile menu after clicking on humburger */}
                <nav className={`md:hidden fixed top-0 right-0 h-screen w-64 bg-white transform transition-transform duration-300 ease-in-out p-6 pt-20 ${isOpenHamburger ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col gap-6 text-lg font-bold text-gray-800">
                        <Link href="/"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300"
                        >
                            صفحه اصلی
                        </Link>

                        <Link href="/products"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300"
                        >
                            محصولات
                        </Link>

                        <Link href="/about"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300"
                        >
                            درباره ما
                        </Link>

                        <Link href="/contact"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300"
                        >
                            تماس با ما
                        </Link>

                        <Link href="/cart"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300"
                        >
                            سبد خرید
                        </Link>
                    </div>
                </nav>

            </div>
        </header>
    )
}