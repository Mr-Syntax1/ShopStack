// متادیتای استاتیک برای صفحه لیست محصولات
export const productsMetadata = {
    title: "محصولات | OnlineShop",
    description: "مشاهده و خرید بهترین محصولات دیجیتال در OnlineShop. قیمت مناسب، ارسال سریع و کیفیت عالی.",
    openGraph: {
        title: "محصولات | OnlineShop",
        description: "مشاهده و خرید بهترین محصولات دیجیتال در OnlineShop. قیمت مناسب، ارسال سریع و کیفیت عالی.",
        images: [
            {
                url: "/images/logo.png",
                width: 1200,
                height: 630,
                alt: "محصولات OnlineShop"
            }
        ],
        url: "https://onlineshop.ir/products",
        type: "website",
        siteName: "OnlineShop",
        locale: "fa_IR",
    },
    twitter: {
        card: "summary_large_image",
        title: "محصولات | OnlineShop",
        description: "مشاهده و خرید بهترین محصولات دیجیتال در OnlineShop.",
        images: ["/images/logo.png"],
    },
    robots: "index, follow",
};

// متادیتای داینامیک برای هر محصول
export function generateProductMetadata(product) {
    return {
        title: `${product.title}`,
        description: product.description || "مشاهده کامل مشخصات، قیمت و نظرات محصولات در OnlineShop. خرید آسان و ارسال سریع.",
        openGraph: {
            title: `${product.title} | OnlineShop`,
            description: product.description || "مشاهده کامل مشخصات، قیمت و نظرات محصولات در OnlineShop. خرید آسان و ارسال سریع.",
            images: [
                {
                    url: product.image || "/images/logo.png",
                    width: 1200,
                    height: 630,
                    alt: product.title
                }
            ],
            url: `https://onlineshop.ir/products/${product.slug || product.id}`,
            type: "website",
            siteName: "OnlineShop",
            locale: "fa_IR",
        },
        twitter: {
            card: "summary_large_image",
            title: `${product.title} | OnlineShop`,
            description: product.description || "مشاهده کامل مشخصات، قیمت و نظرات محصولات در OnlineShop.",
            images: [product.image || "/images/logo.png"],
        },
        robots: "index, follow",
        alternates: {
            canonical: `/products/${product.slug || product.id}`,
        },
    };
}