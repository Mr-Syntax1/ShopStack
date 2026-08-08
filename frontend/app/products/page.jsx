import { productsMetadata } from "@/metadata/products";
import AllProducts from "@/components/Products/AllProducts";

export const metadata = productsMetadata;

export default async function ProductsPage({ searchParams }) {
    // منتظر ماندن برای searchParams
    const params = await searchParams;
    const category = params?.category || 'همه';
    const page = params?.page || 1;

    // const url = new URL('api/products');
    const url = new URL('http://localhost:3000/api/products');

    // دریافت محصولات با مدیریت خطا
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            // افزودن timeout برای جلوگیری از هنگ کردن
            signal: AbortSignal // 10 ثانیه تایم‌اوت
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const products = await res.json();

        // اطمینان از اینکه products آرایه است
        const safeProducts = Array.isArray(products) ? products : [];

        return (
            <AllProducts
                initialProducts={safeProducts}
                initialCategory={category}
                initialPage={page}
            />
        );
    } catch (error) {
        console.error('Error fetching products:', error);

        // در صورت خطا، یک آرایه خالی برگردان
        return (
            <AllProducts
                initialProducts={[]}
                initialCategory={category}
                initialPage={page}
            />
        );
    }
}