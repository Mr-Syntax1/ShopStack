import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/persian';
import StockBadge from './StockBadge';
import DeleteButton from './DeleteButton';

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const ViewIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export default function ProductTable({ products, onDelete }) {
    return (
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
                            برند
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
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
                        <tr key={product.slug || product._id} className="hover:bg-gray-50/50 transition-colors">
                            {/* محصول */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                بدون تصویر
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-gray-400 hidden sm:block">
                                            کد: {product.slug || 'N/A'}
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

                            {/* برند */}
                            <td className="px-4 py-3 hidden md:table-cell">
                                <span className="text-sm text-gray-600">
                                    {product.brand || '—'}
                                </span>
                            </td>

                            {/* موجودی */}
                            <td className="px-4 py-3 hidden lg:table-cell">
                                <span className={`text-sm font-medium ${product.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>
                                    {product.stock}
                                </span>
                            </td>

                            {/* قیمت */}
                            <td className="px-4 py-3">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-xs text-green-600">
                                            {product.discount}% تخفیف
                                        </span>
                                    )}
                                </div>
                            </td>

                            {/* وضعیت */}
                            <td className="px-4 py-3">
                                <StockBadge stock={product.stock} />
                            </td>

                            {/* عملیات */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/dashboard/products/edit/${product.slug}`}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                        title="ویرایش محصول"
                                    >
                                        <EditIcon />
                                    </Link>
                                    <Link
                                        href={`http://localhost:3000/products/${product.slug}`}
                                        target="_blank"
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        title="مشاهده در سایت"
                                    >
                                        <ViewIcon />
                                    </Link>
                                    <DeleteButton
                                        productSlug={product.slug}
                                        productTitle={product.title}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}