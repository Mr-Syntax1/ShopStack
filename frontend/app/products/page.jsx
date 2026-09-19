import { productsMetadata } from "@/metadata/products";
import AllProducts from "@/components/Products/AllProducts";

export const metadata = productsMetadata;

export default async function ProductsPage({ searchParams }) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL

    // منتظر ماندن برای searchParams
    const params = await searchParams;
    const category = params?.category || 'همه';
    const page = params?.page || 1;// برای پرش نکردن

    // const url = new URL('api/products');
    const url = new URL(`${API_URL}/api/products`);

    // دریافت محصولات با مدیریت خطا (بدون ساختن JSX داخل try/catch)
    let safeProducts = [];
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            // افزودن timeout برای جلوگیری از هنگ کردن
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const products = await res.json();

        // اطمینان از اینکه products آرایه است
        safeProducts = Array.isArray(products) ? products : [];
    } catch (error) {
        console.error('Error fetching products:', error);
        // در صورت خطا، آرایه خالی استفاده می‌شود
        safeProducts = [];
    }

    return (
        <AllProducts
            initialProducts={safeProducts}
            initialCategory={category}
            initialPage={page}
        />
    );
}
