// components/products/ProductForm.jsx
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductForm({ onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        brand: '',
        stock: '',
        discount: '',
        tags: [],
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [formData.image]);

    // دریافت دسته‌بندی‌ها از دیتابیس
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetch('http://localhost:3001/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.map(cat => cat.name || cat));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // تغییر فیلدها
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
        // پاک کردن خطا
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // تغییر دسته‌بندی
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setIsNewCategory(true);
            setFormData(prev => ({ ...prev, category: '' }));
        } else {
            setIsNewCategory(false);
            setFormData(prev => ({ ...prev, category: value }));
        }
    };

    // اضافه کردن تگ
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    // حذف تگ
    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // اعتبارسنجی
    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'عنوان محصول الزامی است';
        if (!formData.price || formData.price <= 0) newErrors.price = 'قیمت معتبر الزامی است';
        if (!formData.description) newErrors.description = 'توضیحات الزامی است';
        if (!formData.category) newErrors.category = 'دسته‌بندی الزامی است';
        if (!formData.image) newErrors.image = 'آدرس تصویر الزامی است';
        if (!formData.brand) newErrors.brand = 'برند الزامی است';
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'موجودی معتبر الزامی است';
        if (formData.discount < 0 || formData.discount > 100) newErrors.discount = 'تخفیف باید بین 0 تا 100 باشد';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ارسال فرم
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        } else {
            toast.error('لطفاً فرم را کامل کنید');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* عنوان */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        عنوان محصول <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="مثال: گوشی سامسونگ گلکسی S24"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.title ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                </div>

                {/* قیمت */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        قیمت (تومان) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="مثال: 45000000"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                    )}
                </div>

                {/* موجودی */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        موجودی <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="مثال: 10"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.stock ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.stock && (
                        <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                    )}
                </div>

                {/* برند */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        برند <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="مثال: سامسونگ"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.brand ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.brand && (
                        <p className="mt-1 text-sm text-red-500">{errors.brand}</p>
                    )}
                </div>

                {/* تخفیف */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        تخفیف (درصد)
                    </label>
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="مثال: 10"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.discount ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.discount && (
                        <p className="mt-1 text-sm text-red-500">{errors.discount}</p>
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
                                value={isNewCategory ? 'new' : formData.category}
                                onChange={handleCategoryChange}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.category ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                                    }`}
                            >
                                <option value="">انتخاب دسته‌بندی</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="new" className="text-indigo-600 font-medium"> ایجاد دسته جدید</option>
                            </select>

                            {/* ورودی دسته جدید */}
                            {isNewCategory && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => {
                                            setNewCategory(e.target.value);
                                            setFormData(prev => ({ ...prev, category: e.target.value }));
                                        }}
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
                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                </div>

                {/* آدرس تصویر */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        آدرس تصویر <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="مثال: /images/products/product.webp"
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${errors.image ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.image && (
                        <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                    )}

                    {/* پیش‌نمایش با fallback */}
                    {formData.image && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">پیش‌نمایش:</p>
                            <div className="relative w-20 h-20 rounded-lg border border-gray-200 mt-1 overflow-hidden bg-gray-50 flex items-center justify-center">
                                {!imageError ? (
                                    <img
                                        src={formData.image}
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
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="توضیحات کامل محصول..."
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none ${errors.description ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
                            }`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
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
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map(tag => (
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
                            در حال افزودن...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            افزودن محصول
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