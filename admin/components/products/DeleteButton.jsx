'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const DangerIcon = () => (
    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

export default function DeleteButton({ productSlug, productTitle, onDelete }) {
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products/${productSlug}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('خطا در حذف محصول');

            toast.success(`محصول "${productTitle}" با موفقیت حذف شد`);
            onDelete(productSlug);
            setShowModal(false);
        } catch (error) {
            toast.error('خطا در حذف محصول');
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
                title="حذف محصول"
            >
                <DeleteIcon />
            </button>

            {/* مودال تایید حذف */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <DangerIcon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">حذف محصول</h3>
                            <p className="text-gray-600 mb-6">
                                آیا از حذف محصول <span className="font-semibold text-gray-800">"{productTitle}"</span> اطمینان دارید؟
                                <br />
                                <span className="text-sm text-red-500">این عمل غیرقابل بازگشت است!</span>
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                    disabled={isDeleting}
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                >
                                    {isDeleting ? (
                                        <>
                                            <SpinnerIcon />
                                            در حال حذف...
                                        </>
                                    ) : (
                                        'حذف محصول'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}