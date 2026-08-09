"use client";

import { useState } from "react";
import Link from "next/link";

const ranges = ["امروز", "۷ روز", "۳۰ روز"];

export default function GreetingHeader() {
  const [active, setActive] = useState("۷ روز");
  const today = new Date();
  const persianDate = today.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[13px] font-medium text-gray-400">
          {persianDate}
        </p>
        <h1 className="mt-1 font-bold text-[26px] tracking-tight text-gray-800 sm:text-[30px]">
          صبح بخیر، مدیر
        </h1>
        <p className="mt-1.5 text-[14px] text-gray-500">
          فروشگاه شما امروز{' '}
          <span className="font-semibold text-indigo-600">۱۲,۴۵۰,۰۰۰ تومان</span> فروش داشته —

          <span className="text-green-600 font-medium"> ۱۵٪</span> بیشتر از دیروز.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* فیلتر بازه زمانی */}
        <div className="flex items-center gap-0.5 rounded-full border border-gray-200/80 bg-white p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setActive(r)}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-all duration-200 ${active === r
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* دکمه خروجی */}
        <button className="hidden h-[34px] items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-3.5 text-[13px] font-medium text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 sm:flex">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          خروجی
        </button>

        {/* دکمه افزودن محصول */}
        <Link
          href="/dashboard/products/add"
          className="flex h-[34px] items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 text-[13px] font-medium text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 4v16m8-8H4" />
          </svg>
          افزودن محصول
        </Link>
      </div>
    </div>
  );
}