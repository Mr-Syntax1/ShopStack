import { cartMetadata } from "@/metadata/cart";
import CartClient from "./CartClient";

export const metadata = cartMetadata;

export default function CartPage() {
    return <CartClient />;
}