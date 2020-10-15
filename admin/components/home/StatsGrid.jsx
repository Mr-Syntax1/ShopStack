"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "@/lib/dashboard-api";

function formatValue(value, suffix) {
  const formatted = value >= 1000 ? value.toLocaleString("fa-IR") : value.toString();
  return `${formatted}${suffix ?? ""}`;
}

export default function StatsGrid({ range, refreshKey = 0, onRangeChange }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (selectedRange = range, forceRefresh = refreshKey > 0) => {
    try {
      setLoading(true);   // 👈 موقع لود مجدد، اسکلتون
      const data = await getDashboardData(selectedRange, forceRefresh);   // 👈 range پاس بده
      const apiStats = data?.stats || {};
      setStats([
        {
          key: "sales",
          label: `فروش ${apiStats.periodLabel || ''}`,
          value: apiStats.periodSales || 0,
          suffix: " تومان",
          delta: apiStats.salesDelta || 0,
          trend: (apiStats.salesDelta || 0) >= 0 ? "up" : "down",
        },
        {
          key: "orders",
          label: "سفارشات",
          value: apiStats.periodOrders || 0,
          delta: apiStats.ordersDelta || 0,
          trend: (apiStats.ordersDelta || 0) >= 0 ? "up" : "down",
        },
        {
          key: "customers",
          label: "مشتریان جدید",
          value: apiStats.newCustomers || 0,
          delta: apiStats.customersDelta || 0,
          previous: apiStats.newCustomersPrev || 0,
          trend: (apiStats.customersDelta || 0) >= 0 ? "up" : "down",
        },
        {
          key: "conversion",
          label: "نرخ تبدیل",
          value: apiStats.conversionRate || 0,
          suffix: "%",
          delta: apiStats.conversionDelta || 0,
          trend: (apiStats.conversionDelta || 0) >= 0 ? "up" : "down",
        },
      ]);

      // اطلاع‌رسانی به والد (اگر تابع وجود دارد)
      if (onRangeChange) {
        onRangeChange(selectedRange);
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [range, refreshKey, onRangeChange]);

  // وقتی کاربر روی یکی از دکمه‌های بازه کلیک می‌کند، داده‌ها را با بازه جدید دریافت می‌کند.
  useEffect(() => {
    // اجرای فچ را به microtask عقب می‌اندازیم تا بدنه افکت مستقیماً setState صدا نزند
    let active = true;
    queueMicrotask(() => {
      if (active) fetchData(range, refreshKey > 0);
    });
    return () => { active = false; };
  }, [range, refreshKey, fetchData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-24 mt-3 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {stats.map((stat) => {
        const isUp = stat.trend === "up";

        const iconMap = {
          "sales": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          "orders": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
          "customers": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          "conversion": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        };

        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-[0_8px_24px_-12px_rgba(79,70,229,0.18)] hover:-translate-y-0.5"
          >
            {/* هدر */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                  {iconMap[stat.key] || (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-[13px] font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>

              {stat.delta !== 0 && (
                Math.abs(stat.delta) >= 100 ? (
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${isUp
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                      }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M5 15l7-7 7 7M5 19l7-7 7 7" />
                    </svg>
                    <span className="tabular-nums">{Math.round(Math.abs(stat.delta) / 100)}×</span>
                    <span className="text-[10px] font-medium opacity-80">برابر</span>
                  </span>
                ) : (
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${isUp
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                      }`}
                  >
                    {isUp ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {Math.abs(stat.delta)}%
                  </span>
                )
              )}
            </div>

            {/* مقدار اصلی */}
            <p className="mt-3 text-[26px] font-bold text-gray-800">
              {formatValue(stat.value, stat.suffix)}
            </p>

            {/* خط تزئینی زیرین */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        );
      })}
    </div>
  );
}