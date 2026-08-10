"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { stats } from "@/lib/mock-data";

function formatValue(value, prefix, suffix) {
  const formatted = value >= 1000 ? value.toLocaleString("fa-IR") : value.toString();
  return `${prefix ?? ""}${formatted}${suffix ?? ""}`;
}

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const isUp = stat.trend === "up";
        const sparkData = stat.spark.map((v, i) => ({ i, v }));
        const gradientId = `spark-${stat.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`;

        const iconMap = {
          "فروش کل": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          "سفارشات": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
          "مشتریان جدید": (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
          "نرخ تبدیل": (
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
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20`}>
                  {iconMap[stat.label] || (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-[13px] font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>

              {/* درصد تغییر */}
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
            </div>

            {/* مقدار اصلی */}
            <p className="mt-3 text-[26px] font-bold text-gray-800">
              {formatValue(stat.value, stat.prefix, stat.suffix)}
            </p>

            {/* اسپارک لاین (نمودار کوچک) */}
            <div className="mt-3 h-10 -mx-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sparkData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#4f46e5"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="#4f46e5"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#4f46e5"
                    strokeWidth={1.75}
                    fill={`url(#${gradientId})`}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* خط تزئینی زیرین */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        );
      })}
    </div>
  );
}