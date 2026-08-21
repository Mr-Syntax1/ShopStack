// components/ShareButton.jsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ShareButton() {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            toast.success('🔗 لینک محصول کپی شد!');

            setTimeout(() => setIsCopied(false), 3000);
        } catch (error) {
            // برا مرورگر های قدیمی
            const textarea = document.createElement('textarea');
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            toast.success('🔗 لینک محصول کپی شد!');
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-full sm:flex-1 py-3 sm:py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
        >
            {isCopied ? (
                // آیکون تیک (بعد از کپی)
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                // آیکون اشتراک‌گذاری (قبل از کپی)
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            )}
            <span>{isCopied ? 'کپی شد!' : 'اشتراک‌گذاری'}</span>
        </button>
    );
}