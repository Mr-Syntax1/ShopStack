// components/cart/CartItems.jsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from '@/lib/persian';
import { useCart } from "@/context/CartContext";

export default function CartItems() {
    const { cart: items, removeFromCart, updateQuantity, clearCart } = useCart();

    if (items.length === 0) return null;

    return (
        <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
                <div
                    key={item._id || item.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 overflow-hidden"
                >
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                        {/* تصویر */}
                        <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {item.discount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {item.discount}%
                                </span>
                            )}
                        </div>

                        {/* اطلاعات */}
                        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex-1">
                                <Link href={`/products/${item.slug || item.id}`}>
                                    <h3 className="font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer text-sm sm:text-base line-clamp-2">
                                        {item.title}
                                    </h3>
                                </Link>
                                <p className="text-lg font-bold text-blue-600">
                                    {formatPrice(item.price)}
                                </p>
                            </div>

                            {/* تعداد */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (item.quantity <= 1) {
                                            removeFromCart(item._id || item.id);
                                        } else {
                                            updateQuantity(item._id || item.id, item.quantity - 1);
                                        }
                                    }}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-bold text-gray-800">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            {/* قیمت کل */}
                            <div className="text-right min-w-[100px]">
                                <p className="text-xs text-gray-400">قیمت کل</p>
                                <p className="font-bold text-gray-800">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>

                            {/* دکمه حذف */}
                            <button
                                onClick={() => removeFromCart(item._id || item.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                                aria-label="حذف"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* دکمه‌های پایین لیست */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                    href="/products"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    ادامه خرید
                </Link>

                <button
                    onClick={() => {
                        if (confirm('آیا از خالی کردن سبد خرید مطمئن هستید؟')) {
                            clearCart();
                        }
                    }}
                    className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer px-3 py-1 hover:bg-red-50 rounded-lg flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    خالی کردن سبد
                </button>
            </div>
        </div>
    );
}