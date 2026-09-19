"use client";

import { useAdminAccess } from "@/lib/AdminReadOnlyContext";

export default function ReadOnlyOverlay({ message }) {
    const { isReadOnly, message: roMessage } = useAdminAccess();

    if (!isReadOnly) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-semibold text-amber-800">
                    {message || roMessage}
                </p>
            </div>
        </div>
    );
}
