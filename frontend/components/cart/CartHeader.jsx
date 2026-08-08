// components/cart/CartHeader.jsx
'use client'

import { useCart } from "@/context/CartContext";

export default function CartHeader({ itemCount: initialCount = 0 }) {
    const { cart: items } = useCart();
    const count = items.length > 0 ? items.length : initialCount;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shadow-blue-500/25">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 pb-3">سبد خرید</h1>
                    <p className="text-sm text-gray-400">محصولات انتخاب شده را مرور کنید</p>
                </div>
            </div>
            <span className="text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                {count} محصول در سبد
            </span>
        </div>
    );
}