'use client'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "../lib/persian";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context";
import { createPortal } from "react-dom";
import Avatar from "@/components/Avatar";

const API_CLIENT_URL = process.env.NEXT_PUBLIC_API_URL
const API_ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL


export default function Header() {
    const [isOpenHamburger, setIsOpenHamburger] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { cart } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    // برای اطمینان از اجرا در کلاینت
    useEffect(() => {
        // اجرا را به microtask عقب می‌اندازیم تا بدنه افکت مستقیماً setState صدا نزند
        queueMicrotask(() => setMounted(true));
    }, []);

    // قفل کردن اسکرول و مدیریت Escape
    useEffect(() => {
        if (isOpenHamburger) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpenHamburger) {
                setIsOpenHamburger(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpenHamburger]);

    // جلوگیری از کلیک روی محتوای پشت منو
    const handleOverlayClick = () => {
        setIsOpenHamburger(false);
    };

    // تعیین مسیر پروفایل بر اساس نقش
    const getProfileLink = () => {
        if (user?.role === 'admin') {
            return `${API_ADMIN_URL}/dashboard`; // ادمین
        }
        return `${API_CLIENT_URL}/profile`; // کاربر عادی
    };

    const handleLogout = async () => {
        await logout();
        setIsOpenHamburger(false);
    };

    return (
        <header className="bg-white/30 backdrop-blur-xl text-black shadow-lg fixed w-full top-0 z-50 font-sans text-sm border-b border-white/20">
            <div className="container mx-auto px-2 py-2 flex items-center justify-between">

                {/* logo */}
                <Link href="/" className="shrink-0">
                    <Image
                        src={'/images/logo.png'}
                        alt="logo"
                        width={96}
                        height={96}
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* desktop menu */}
                <nav className="hidden md:flex items-center gap-8 font-semibold">
                    <Link href="/"
                        className="text-gray-800 hover:text-blue-700 transition"
                    >
                        صفحه اصلی
                    </Link>

                    <Link href="/products" className="text-gray-800 hover:text-blue-700 transition">
                        محصولات
                    </Link>

                    <Link href="/about"
                        className="text-gray-800 hover:text-blue-700 transition"
                    >
                        درباره ما
                    </Link>

                    <Link href="/contact"
                        className="text-gray-800 hover:text-blue-700 transition"
                    >
                        تماس با ما
                    </Link>
                </nav>

                {/* buttons = cart and hamburger and login */}
                <div className="flex items-center ml-2 md:ml-0">

                    {/* login button desktop */}
                    {!isAuthenticated ? (
                        <Link
                            href="/auth/login"
                            className="hidden md:flex px-4 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            ورود
                        </Link>
                    ) : (
                        <Avatar
                            name={user?.name}
                            href={getProfileLink()}
                            className="ml-3 md:ml-0"
                            size="md"
                        />
                    )}

                    {/* cart icon */}
                    <Link
                        href="/cart"
                        className="hidden md:flex p-2 rounded-lg transition relative mr-4"
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
                            {formatPrice(cart.length)}
                        </span>
                    </Link>

                    {/* hamburger button */}
                    <button
                        onClick={() => setIsOpenHamburger(!isOpenHamburger)}
                        className="md:hidden p-2 rounded-lg transition relative z-50 cursor-pointer"
                        aria-label="Toggle menu"
                        aria-expanded={isOpenHamburger}
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

                {/* Overlay - برای تاری و بستن منو با کلیک */}
                {mounted && isOpenHamburger && createPortal(
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                        onClick={handleOverlayClick}
                        style={{
                            opacity: isOpenHamburger ? 1 : 0,
                            pointerEvents: isOpenHamburger ? 'auto' : 'none'
                        }}
                    />,
                    document.body
                )}

                {/* mobile menu after clicking on hamburger */}
                <nav className={`
                    md:hidden fixed top-0 right-0 h-screen w-64 bg-white transform transition-transform duration-300 ease-in-out p-6 pt-20 z-50
                    ${isOpenHamburger ? 'translate-x-0' : 'translate-x-full'}
                    shadow-2xl
                `}>
                    {/* دکمه بستن داخل منو (برای دسترسی بهتر) */}
                    <button
                        onClick={() => setIsOpenHamburger(false)}
                        className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        aria-label="Close menu"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* آواتار کاربر در منوی موبایل */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                            <Avatar
                                name={user?.name}
                                href={getProfileLink()}
                                size="md"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{user?.name || 'کاربر'}</p>
                                <p className="text-xs text-gray-500 mb-2">{user?.email || ''}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {user?.role === 'admin' ? 'مدیر' : 'کاربر'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-6 text-lg font-bold text-gray-800">
                        <Link href="/"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            صفحه اصلی
                        </Link>

                        <Link href="/products"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            محصولات
                        </Link>

                        <Link href="/about"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            درباره ما
                        </Link>

                        <Link href="/contact"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            تماس با ما
                        </Link>

                        <Link href="/cart"
                            onClick={() => setIsOpenHamburger(false)}
                            className="hover:text-blue-500 transition-all duration-300 flex items-center gap-3 relative"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            سبد خرید
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-3 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {formatPrice(cart.length)}
                                </span>
                            )}
                        </Link>

                        {/* دکمه خروج در منوی موبایل */}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="mt-4 pt-4 border-t border-gray-200 text-red-500 hover:text-red-600 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                خروج
                            </button>
                        )}

                        {/* دکمه ورود در منوی موبایل */}
                        {!isAuthenticated && (
                            <Link
                                href="/auth/login"
                                onClick={() => setIsOpenHamburger(false)}
                                className="mt-4 pt-4 border-t border-gray-200 text-indigo-600 hover:text-indigo-700 transition-all duration-300 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                ورود / ثبت‌نام
                            </Link>
                        )}
                    </div>
                </nav>

            </div >
        </header >
    );
}