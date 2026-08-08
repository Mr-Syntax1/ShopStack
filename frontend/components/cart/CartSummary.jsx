// components/cart/CartSummary.jsx
'use client'

import { useCart } from "@/context/CartContext";
import { formatPrice } from '@/lib/persian';
import UserForm from "./UserForm";

export default function CartSummary() {
    const {
        cart: items,
        cartTotal: subtotal,
        finalTotal: total,
        shippingCost,
    } = useCart();

    if (items.length === 0) return null;

    return (
        <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-6 sticky top-24">

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100/50 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    خلاصه سفارش
                </h2>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">قیمت محصولات</span>
                        <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">هزینه ارسال</span>
                        {shippingCost === 0 ? (
                            <span className="flex items-center gap-1 text-green-500 font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                رایگان
                            </span>
                        ) : (
                            <span className="font-medium text-gray-800">{formatPrice(shippingCost)}</span>
                        )}
                    </div>
                    {shippingCost === 0 && subtotal > 0 && (
                        <div className="text-xs text-green-500 bg-green-50 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومан
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100/50">
                        <span className="text-gray-800">مجموع</span>
                        <span className="text-blue-600 text-xl">{formatPrice(total)}</span>
                    </div>
                </div>

                <UserForm />
            </div>
        </div>
    );
}