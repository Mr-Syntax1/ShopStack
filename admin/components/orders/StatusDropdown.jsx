'use client';

// منوی تغییر وضعیت سفارش

import { useState, useEffect, useRef } from 'react';
import { STATUS } from '@/lib/statusData';
import { useAdminAccess } from "@/lib/AdminReadOnlyContext";


const STATUS_KEYS = Object.keys(STATUS);

export default function StatusDropdown({ currentStatus, orderId, onStatusChange }) {
    const { isReadOnly } = useAdminAccess();
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = async (newStatus) => {
        if (isReadOnly) return;
        setIsUpdating(true);
        await onStatusChange(orderId, newStatus);
        setIsUpdating(false);
        setIsOpen(false);
    };

    const currentStatusInfo = STATUS[currentStatus] || STATUS.pending;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    if (isReadOnly) return;
                    setIsOpen(!isOpen);
                }}
                disabled={isUpdating || isReadOnly}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-all ${currentStatusInfo.classes} hover:ring-2 hover:ring-offset-1 disabled:opacity-50 ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${currentStatusInfo.dot}`} />
                {currentStatusInfo.label}
                <svg className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && !isReadOnly && (
                <div className="absolute right-0 mt-1 min-w-[140px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-10">
                    {STATUS_KEYS.map((key) => (
                        <button
                            key={key}
                            onClick={() => handleStatusChange(key)}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-[12.5px] transition-colors hover:bg-gray-50 ${key === currentStatus ? 'bg-indigo-50/50' : ''}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS[key].dot}`} />
                            {STATUS[key].label}
                            {key === currentStatus && (
                                <svg className="mr-auto h-3.5 w-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}