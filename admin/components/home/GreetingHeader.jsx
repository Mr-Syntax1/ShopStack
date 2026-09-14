"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard-api";

const ranges = [
  { label: "۷ روز", value: "7days" },
  { label: "۳۰ روز", value: "30days" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 4) return "شب بخیر";
  if (hour >= 4 && hour < 6) return "سپیده دم بخیر";
  if (hour >= 6 && hour < 8) return "صبح بخیر";
  if (hour >= 8 && hour < 12) return "صبح به خیر";
  if (hour >= 12 && hour < 14) return "ظهر بخیر";
  if (hour >= 14 && hour < 17) return "عصر به خیر";
  if (hour >= 17 && hour < 20) return "عصر بخیر";
  return "شب به خیر";
}

export default function GreetingHeader({ range, onRangeChange, onRefresh }) {
  const [greetingData, setGreetingData] = useState({
    periodSales: 0,
    salesDelta: 0,
    periodLabel: '۷ روز اخیر',
  });
  const [adminName, setAdminName] = useState("مدیر");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (selectedRange = range) => {
    try {
      const userRes = await fetch('/api/auth/me', { credentials: 'include' });

      if (userRes.ok) {
        const userData = await userRes.json();
        setAdminName(userData.user?.name || "مدیر");
      }

      const data = await getDashboardData(selectedRange);
      setGreetingData(data?.greeting || {
        periodSales: 0,
        salesDelta: 0,
        periodLabel: '۷ روز اخیر',
      });

      if (onRangeChange) {
        onRangeChange(selectedRange);
      }
    } catch (error) {
      console.error('Error fetching greeting data:', error);
    } finally {
      setLoading(false);
    }
  }, [range, onRangeChange]);

  const handleRangeChange = (rangeValue) => {
    fetchData(rangeValue);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await fetchData(range);
      if (onRefresh) onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const today = new Date();
  const persianDate = today.toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatSales = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} میلیون تومان`;
    }
    return `${value.toLocaleString("fa-IR")} تومان`;
  };

  const isUp = (greetingData.salesDelta || 0) >= 0;

  if (loading) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded-full w-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[13px] font-medium text-gray-400">
          {persianDate}
        </p>
        <h1 className="mt-1 font-bold text-[26px] tracking-tight text-gray-800 sm:text-[30px]">
          {getGreeting()}، {adminName}
        </h1>
        <p className="mt-1.5 text-[14px] text-gray-500">
          فروشگاه شما در {greetingData.periodLabel}{' '}
          <span className="font-semibold text-indigo-600">
            {formatSales(greetingData.periodSales)}
          </span>{' '}
          فروش داشته —
          {greetingData.salesDelta !== 0 && (
            <span className={`${isUp ? 'text-green-600' : 'text-rose-600'} font-medium`}>
              {' '}{isUp ? ' بیشتر' : ' کمتر'} از دوره قبل ({Math.abs(greetingData.salesDelta)}٪)
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* 👇 دکمه به‌روزرسانی */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex h-[34px] items-center justify-center gap-2 rounded-full border border-gray-200/80 bg-white px-3.5 text-[13px] font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          به‌روزرسانی
        </button>

        {/* فیلتر بازه زمانی */}
        <div className="flex items-center gap-0.5 rounded-full border border-gray-200/80 bg-white p-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRangeChange(r.value)}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${range === r.value
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* دکمه افزودن محصول */}
        <Link
          href="/dashboard/products/new"
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