// components/cart/CartContent.jsx
'use client'

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";

export default function CartContent({ initialCart = [] }) {
    const { cart: items, setCart } = useCart();

    // پر کردن سبد خرید با دیتای سرور
    useEffect(() => {
        if (initialCart.length > 0 && items.length === 0) {
            setCart(initialCart);
        }
    }, [initialCart, items.length, setCart]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartItems />
            <CartSummary />
        </div>
    );
}