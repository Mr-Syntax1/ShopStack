'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function DeleteButton({
    slug,          // ← اسم کلی (برای محصولات = productSlug، برای سفارشات = orderId)
    title,         // ← عنوان
    onDelete,      // ← تابع حذف
    deleteUrl,     // ← آدرس API (مثلاً `/api/products/${slug}`)
    successMessage,// ← پیام موفقیت
}) {
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${API_URL}${deleteUrl}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('خطا در حذف');

            toast.success(successMessage || `با موفقیت حذف شد`);
            onDelete(slug);
            setShowModal(false);
        } catch (error) {
            toast.error('خطا در حذف');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="حذف"
            >
                <DeleteIcon />
            </button>

            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title="حذف"
                message={`آیا از حذف "${title}" اطمینان دارید؟`}
                confirmText="حذف"
                cancelText="انصراف"
                isLoading={isDeleting}
                highlightText="این عمل غیرقابل بازگشت است!"
                iconColor="red"
            />
        </>
    );
}