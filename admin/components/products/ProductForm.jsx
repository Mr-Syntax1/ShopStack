// components/products/ProductForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ==============================
// اسکیما برای اعتبارسنجی با Yup
// ==============================
const productSchema = yup.object({
    title: yup
        .string()
        .required('عنوان محصول الزامی است')
        .min(3, 'عنوان حداقل ۳ کاراکتر باشد'),
    price: yup
        .number()
        .required('قیمت الزامی است')
        .positive('قیمت باید بزرگتر از ۰ باشد')
        .typeError('قیمت باید عدد باشد'),
    description: yup
        .string()
        .required('توضیحات الزامی است')
        .min(10, 'توضیحات حداقل ۱۰ کاراکتر باشد'),
    category: yup
        .string()
        .required('دسته‌بندی الزامی است')
        .min(2, 'دسته‌بندی حداقل ۲ کاراکتر باشد'),
    image: yup
        .string()
        .required('آدرس تصویر الزامی است'), // ========================
    brand: yup
        .string()
        .required('برند الزامی است')
        .min(2, 'برند حداقل ۲ کاراکتر باشد'),
    stock: yup
        .number()
        .required('موجودی الزامی است')
        .min(0, 'موجودی نمی‌تواند منفی باشد')
        .typeError('موجودی باید عدد باشد'),
    discount: yup
        .number()
        .min(0, 'تخفیف نمی‌تواند منفی باشد')
        .max(100, 'تخفیف حداکثر ۱۰۰٪ است')
        .typeError('تخفیف باید عدد باشد')
        .default(0),
    tags: yup
        .array()
        .of(yup.string())
        .default([]),
});

// ==============================
//  کامپوننت اصلی
// ==============================
export default function ProductForm({ onSubmit, isLoading, initialData, isEdit = false }) {

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [imageError, setImageError] = useState(false);
    const [displayPrice, setDisplayPrice] = useState('');


    // ==============================
    //  تنظیم React Hook Form با Yup
    // ==============================
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            title: '',
            price: '',
            description: '',
            category: '',
            image: '',
            brand: '',
            stock: '',
            discount: 0,
            tags: [],
        },
    });

    // تماشای مقدار image برای پیش‌نمایش
    const imageValue = watch('image');
    const tagsValue = watch('tags');
    const categoryValue = watch('category');
    // برا به روز کردن مقدار هاشون


    // ==============================
    // مقداردهی اولیه با initialData (برای ویرایش)
    // ==============================
    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || '',
                price: initialData.price || '',
                description: initialData.description || '',
                category: initialData.category || '',
                image: initialData.image || '',
                brand: initialData.brand || '',
                stock: initialData.stock || '',
                discount: initialData.discount || 0,
                tags: initialData.tags || [],
            });

            // تنظیم displayPrice برای نمایش فرمت شده
            setDisplayPrice(formatPrice(initialData.price || ''));
        }
    }, [initialData, reset]);


    // ===========================
    // تابع فرمت کردن عدد
    // ===========================
    const formatPrice = (value) => {
        if (!value) return '';
        const num = String(value).replace(/,/g, '');
        if (isNaN(num) || num === '') return '';
        return new Intl.NumberFormat('en-US').format(num);
    };

    // وقتی initialData تغییر می‌کنه، مقدار رو فرمت کن
    useEffect(() => {
        if (initialData?.price) {
            setDisplayPrice(formatPrice(initialData.price));
        }
    }, [initialData]);

    // هندلر تغییر قیمت
    const handlePriceChange = (e) => {
        const raw = e.target.value.replace(/,/g, '');
        // اگر خالی بود
        if (raw === '') {
            setDisplayPrice('');
            setValue('price', '');
            return;
        }
        // اگر عدد نبود، کاری نکن
        if (isNaN(raw)) return;
        const formatted = formatPrice(raw);
        setDisplayPrice(formatted);
        setValue('price', raw);
    };


    // ==============================
    // دریافت دسته‌بندی‌ها
    // ==============================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetch(`${API_URL}/api/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.map(cat => cat.name || cat));
                    //اگر هر دسته‌بندی یک شیء با name بود، فقط name رو برمیداریم و 
                    // اگر رشته بود، خود رشته رو
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // ==============================
    // مدیریت تگ‌ها
    // ==============================
    const addTag = () => {
        if (tagInput.trim() && !tagsValue.includes(tagInput.trim())) {
            setValue('tags', [...tagsValue, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setValue('tags', tagsValue.filter(tag => tag !== tagToRemove));
    };

    // ==============================
    // مدیریت دسته‌بندی جدید
    // ==============================
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setIsNewCategory(true);
            setValue('category', '');
        } else {
            setIsNewCategory(false);
            setValue('category', value);
        }
    };

    // ==============================
    // ارسال فرم
    // ==============================
    const onFormSubmit = (data) => {
        onSubmit(data);
    };

    // ==============================
    // نمایش فرم
    // ==============================
    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* عنوان */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        عنوان محصول <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('title')}
                        placeholder="مثال: گوشی سامسونگ گلکسی S24"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.title ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>

                {/* قیمت */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        قیمت (تومان) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"  // تغییر به text
                        value={displayPrice}
                        onChange={handlePriceChange}
                        placeholder="مثال: ۴۵,۰۰۰,۰۰۰"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm 
                            ${errors.price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
                    )}
                </div>

                {/* موجودی */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        موجودی <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        {...register('stock')}
                        placeholder="مثال: 10"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.stock ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.stock && (
                        <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>
                    )}
                </div>

                {/* برند */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        برند <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('brand')}
                        placeholder="مثال: سامسونگ"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.brand ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.brand && (
                        <p className="mt-1 text-sm text-red-500">{errors.brand.message}</p>
                    )}
                </div>

                {/* تخفیف */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        تخفیف (درصد)
                    </label>
                    <input
                        type="number"
                        {...register('discount')}
                        placeholder="مثال: 10"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.discount ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.discount && (
                        <p className="mt-1 text-sm text-red-500">{errors.discount.message}</p>
                    )}
                </div>

                {/* دسته‌بندی */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        دسته‌بندی <span className="text-red-500">*</span>
                    </label>
                    {loadingCategories ? (
                        <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
                            در حال بارگذاری...
                        </div>
                    ) : (
                        <>
                            <select
                                value={isNewCategory ? 'new' : categoryValue}
                                onChange={handleCategoryChange}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.category ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                                    }`}
                            >
                                <option value="">انتخاب دسته‌بندی</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}

                                <option value="new" className="text-indigo-600 font-medium">➕ ایجاد دسته جدید</option>
                            </select>

                            {/* ورودی دسته جدید */}
                            {isNewCategory && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        {...register('category')}
                                        placeholder="نام دسته جدید را وارد کنید..."
                                        className="w-full px-4 py-2.5 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm bg-indigo-50"
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        پس از افزودن محصول، دسته جدید به لیست اضافه می‌شود
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    {errors.category && (
                        <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                    )}
                </div>

                {/* آدرس تصویر */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        آدرس تصویر <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('image')}
                        placeholder="مثال: /images/products/product.webp"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.image ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.image && (
                        <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
                    )}

                    {/* پیش‌نمایش */}
                    {imageValue && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">پیش‌نمایش:</p>
                            <div className="relative w-20 h-20 rounded-lg border border-gray-200 mt-1 overflow-hidden bg-gray-50 flex items-center justify-center">
                                {!imageError ? (
                                    <img
                                        src={imageValue}
                                        alt="پیش‌نمایش"
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-[10px] text-gray-400 mt-1">بدون تصویر</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* توضیحات */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        توضیحات <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('description')}
                        rows="4"
                        placeholder="توضیحات کامل محصول..."
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none ${errors.description ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                    )}
                </div>

                {/* تگ‌ها */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        تگ‌ها
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="تگ جدید..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
                        >
                            افزودن
                        </button>
                    </div>
                    {tagsValue.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tagsValue.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-600"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {isEdit ? 'در حال ویرایش...' : 'در حال افزودن...'}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {isEdit ? 'ویرایش محصول' : 'افزودن محصول'}
                        </>
                    )}
                </button>
                <Link
                    href="/products"
                    className="flex-1 sm:flex-none px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center"
                >
                    انصراف
                </Link>
            </div>
        </form>
    );
}