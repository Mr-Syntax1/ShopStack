"use client";

import { useState } from "react";
import Sidebar from "@/components/home/Sidebar";

export default function SidebarWrapper() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* دکمه همبرگر */}
            <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-lg border border-gray-200/80 transition-all duration-200 hover:bg-gray-100 lg:hidden cursor-pointer"
                aria-label="باز کردن منو"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </>
    );
}