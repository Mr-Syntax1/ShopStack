'use client';

import { useState, useEffect } from 'react';

const pageBloomStyles = `
@keyframes adminPageBloom {
    0% { transform: scale(1); filter: blur(0px); }
    100% { transform: scale(1.02); filter: blur(1px); }
}
.admin-page-bloom {
    animation: adminPageBloom 0.4s ease-out forwards;
    transform-origin: center center;
}
`;

// ============================================
// آیکون‌ها
// ============================================
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

// ============================================
// کامپوننت اصلی
// ============================================
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'تأیید',
    message = 'آیا از انجام این عمل اطمینان دارید؟',
    confirmText = 'تأیید',
    cancelText = 'انصراف',
    isLoading = false,
    highlightText = '',
    iconColor = 'red', // red | amber | blue
}) {
    // جلوگیری از اسکرول پس‌زمینه
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // بستن با کلید Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // رنگ‌های مختلف
    const colors = {
        red: {
            bg: 'bg-red-100',
            text: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700',
            border: 'border-red-600',
        },
        amber: {
            bg: 'bg-amber-100',
            text: 'text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700',
            border: 'border-amber-600',
        },
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
            border: 'border-blue-600',
        },
    };

    const color = colors[iconColor] || colors.red;

    if (!isOpen) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: pageBloomStyles }} />
            <div className="admin-page-bloom fixed inset-0 z-40 pointer-events-none" />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center">
                        {/* آیکون */}
                        <div className={`w-16 h-16 mx-auto mb-4 ${color.bg} rounded-full flex items-center justify-center`}>
                            <DangerIcon />
                        </div>

                        {/* عنوان */}
                        <h3 className={`text-xl font-bold ${color.text} mb-2`}>
                            {title}
                        </h3>

                        {/* پیام */}
                        <p className="text-gray-600 mb-6">
                            {message}
                            {highlightText && (
                                <>
                                    <br />
                                    <span className="text-sm text-red-500 font-semibold">{highlightText}</span>
                                </>
                            )}
                        </p>

                        {/* دکمه‌ها */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                                disabled={isLoading}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`px-6 py-2.5 ${color.button} text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer`}
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon />
                                        در حال پردازش...
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
