// app/dashboard/products/page.jsx
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/persian";

async function getProducts() {
    const res = await fetch('http://localhost:3001/api/products', {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('خطا در دریافت محصولات');
    }

    return res.json();
}

export default async function Products() {
    const products = await getProducts();

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* هدر صفحه */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        مدیریت محصولات
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {products.length} محصول در فروشگاه
                    </p>
                </div>
                <Link
                    href="/dashboard/products/add"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 4v16m8-8H4" />
                    </svg>
                    افزودن محصول
                </Link>
            </div>

            {/* جستجو و فیلتر */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="جستجوی محصولات..."
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            />
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <select className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[140px] text-sm">
                        <option value="">همه دسته‌ها</option>
                        <option value="الکترونیک">الکترونیک</option>
                        <option value="گیمینگ">گیمینگ</option>
                        <option value="موبایل">موبایل</option>
                    </select>
                </div>
            </div>

            {/* جدول محصولات */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200/80 bg-gray-50/50">
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    محصول
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                    دسته
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                    موجودی
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    قیمت
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    وضعیت
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                    {/* محصول */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                                    {product.title}
                                                </p>
                                                <p className="text-xs text-gray-400 hidden sm:block">
                                                    {product.brand || 'بدون برند'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* دسته */}
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className="text-sm text-gray-600">
                                            {product.category || 'متفرقه'}
                                        </span>
                                    </td>

                                    {/* موجودی */}
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* قیمت */}
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {formatPrice(product.price)}
                                        </span>
                                    </td>

                                    {/* وضعیت */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.stock > 0 ? 'موجود' : 'ناموجود'}
                                        </span>
                                    </td>

                                    {/* عملیات */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/dashboard/products/${product._id}`}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </Link>
                                            <button

                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* پیام خالی */}
                {products.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-gray-600">هیچ محصولی یافت نشد</h3>
                        <p className="text-gray-400 mt-2">اولین محصول خود را اضافه کنید</p>
                        <Link
                            href="/dashboard/products/add"
                            className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            افزودن محصول
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}