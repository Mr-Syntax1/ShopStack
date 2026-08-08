// components/cart/UserForm.jsx
'use client'

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function UserForm() {
    const { cart: items, clearCart, finalTotal: total } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        postalCode: '',
        address: '',
        country: 'ایران',
    });

    const handleInputChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            alert('سبد خرید شما خالی است!');
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            user: userInfo,
            cart: items,
            totalPrice: total
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('سفارش شما با موفقیت ثبت شد! 🎉');
                clearCart();
                // router.push('/order-success');
            } else {
                alert(data.error || 'خطا در ثبت سفارش');
            }
        } catch (error) {
            console.error('خطا در ثبت سفارش:', error);
            alert('مشکلی در ارتباط با سرور پیش آمد.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                اطلاعات شما
            </h3>

            <div>
                <input
                    type="text"
                    name="name"
                    placeholder="نام و نام خانوادگی"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                    required
                />
            </div>

            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="ایمیل"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                    required
                />
            </div>

            <div>
                <input
                    type="tel"
                    name="phone"
                    placeholder="شماره تماس"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <input
                        type="text"
                        name="city"
                        placeholder="شهر"
                        value={userInfo.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="کد پستی"
                        value={userInfo.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                        required
                    />
                </div>
            </div>

            <div>
                <input
                    type="text"
                    name="address"
                    placeholder="آدرس کامل"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white"
                    required
                />
            </div>

            <div>
                <select
                    name="country"
                    value={userInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm bg-white/50 focus:bg-white cursor-pointer"
                    required
                >
                    <option value="ایران">🇮🇷 ایران</option>
                    <option value="افغانستان">🇦🇫 افغانستان</option>
                    <option value="ترکیه">🇹🇷 ترکیه</option>
                    <option value="امارات">🇦🇪 امارات</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال پردازش...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        پرداخت آنلاین
                    </>
                )}
            </button>
        </form>
    );
}