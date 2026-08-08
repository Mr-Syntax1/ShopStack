'use client';

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { showAddToCartToast } from "./CustomToast";

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (product.stock === 0) {
            toast.error('متاسفانه این محصول موجود نیست!');
            return;
        }

        setIsAdding(true);
        try {
            addToCart(product);
            showAddToCartToast(product); // 👈 همین یک خط کافیه
        } catch (error) {
            toast.error('خطا در افزودن به سبد خرید. لطفاً دوباره تلاش کنید.');
        } finally {
            setIsAdding(false);
        }
    };

    if (product.stock === 0) {
        return (
            <button
                disabled
                className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gray-300 text-gray-500 font-semibold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>ناموجود</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className="w-full sm:flex-1 py-3 sm:py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95 cursor-pointer"
        >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>افزودن به سبد خرید</span>
        </button>
    );
}
