'use client'

import { createContext, useState, useEffect, useMemo, useContext } from "react";

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [isMounted, setIsMounted] = useState(false)

    // خوندن localstorage از سمت کلاینت
    useEffect(() => {
        setIsMounted(true)
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error('خطا در خواندن سبد خرید:', e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])


    // محاسبه تعداد کل آیتم‌ها
    const cartCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }, [cart])


    // محاسبه قیمت کل (با احتساب تخفیف)
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            // قیمت با تخفیف
            const discountedPrice = item.discount > 0
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price
            return total + (discountedPrice * item.quantity)
        }, 0)
    }, [cart])


    // محاسبه هزینه ارسال (خرید بالای ۵۰۰ هزار تومان رایگان)
    const shippingCost = useMemo(() => {
        return cartTotal > 500000 ? 0 : 50000
    }, [cartTotal])


    // قیمت نهایی (مجموع + هزینه ارسال)
    const finalTotal = useMemo(() => {
        return cartTotal + shippingCost
    }, [cartTotal, shippingCost])


    // افزودن محصول به سبد خرید
    function addToCart(product) {
        setCart(prev => {
            // بررسی وجود محصول در سبد
            const selectedProduct = prev.find((item) => item._id === product._id)

            if (!selectedProduct) {
                return [...prev, { ...product, quantity: 1 }]
            }

            else {
                // افزایش تعداد محصول موجود
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
        })
    }


    // // حذف محصول از سبد خرید - پشتیبانی از هر دو شناسه _id و id
    function removeFromCart(productId) {
        setCart(prev => prev.filter((p) => {
            // // بررسی هر دو فیلد شناسه برای اطمینان از حذف صحیح
            return p._id !== productId && p.id !== productId;
        }))
    }


    // // تغییر تعداد محصول - پشتیبانی از هر دو شناسه _id و id
    function updateQuantity(productId, newQuantity) {
        // // اگر تعداد کمتر از ۱ باشد، محصول را حذف کن
        if (newQuantity < 1) {
            removeFromCart(productId)
            return
        }

        setCart(prev =>
            prev.map(item => {
                // // بررسی هر دو فیلد شناسه برای یافتن صحیح محصول
                const isMatch = item._id === productId || item.id === productId;
                return isMatch
                    ? { ...item, quantity: newQuantity }
                    : item;
            })
        )
    }


    // خالی کردن کامل سبد خرید
    function clearCart() {
        setCart([])
    }


    // دریافت قیمت محصول با تخفیف
    function getDiscountedPrice(product) {
        if (product.discount > 0) {
            return Math.round(product.price * (1 - product.discount / 100))
        }
        return product.price
    }


    // دریافت قیمت کل یک محصول (با تعداد)
    function getItemTotal(product) {
        const discountedPrice = getDiscountedPrice(product)
        return discountedPrice * product.quantity
    }


    // مقادیر ارائه شده به Context
    return (
        <CartContext.Provider value={{
            cart,                    // لیست محصولات سبد خرید
            setCart,
            cartCount,               // تعداد کل آیتم‌ها
            cartTotal,               // قیمت کل (با تخفیف)
            shippingCost,            // هزینه ارسال
            finalTotal,              // قیمت نهایی
            addToCart,               // افزودن محصول
            removeFromCart,          // حذف محصول
            updateQuantity,          // تغییر تعداد
            clearCart,               // خالی کردن سبد
            getDiscountedPrice,      // دریافت قیمت با تخفیف
            getItemTotal,            // دریافت قیمت کل یک محصول
        }}>
            {children}
        </CartContext.Provider>
    )
}
export function useCart() {
    const context = useContext(CartContext)
    // اگر خارج از Provider استفاده شود، خطا بده
    if (!context) {
        throw new Error('useCart باید داخل CartProvider استفاده شود')
    }
    return context
}