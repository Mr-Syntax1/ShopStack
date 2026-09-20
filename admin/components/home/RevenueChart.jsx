"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardData } from "@/lib/dashboard-api";

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white/95 backdrop-blur-sm px-3.5 py-2.5 shadow-lg shadow-gray-500/5">
      <p className="text-[11px] font-medium text-gray-400">{d.day}</p>
      <p className="mt-0.5 text-[15px] font-bold text-gray-800">
        {d.revenue.toLocaleString("fa-IR")} تومان
      </p>
      <p className="text-[11.5px] text-gray-500">{d.orders} سفارش</p>
    </div>
  );
}

export default function RevenueChart({ range = '7days', refreshKey }) {
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDashboardData(range, refreshKey > 0);
        setRevenueSeries(data?.revenueSeries || []);
      } catch (error) {
        console.error('Error fetching revenue:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range, refreshKey]);

  // محاسبه مجموع و میانگین
  const totalRevenue = revenueSeries.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const avgRevenue = revenueSeries.length > 0 ? Math.round(totalRevenue / revenueSeries.length) : 0;
  const totalOrders = revenueSeries.reduce((sum, d) => sum + (d.orders || 0), 0);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded mt-4 animate-pulse" />
      </div>
    );
  }

  const rangeLabel = range === 'today' ? 'امروز' : range === '30days' ? '۳۰ روز اخیر' : '۷ روز اخیر';

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-[15px] text-gray-800">
            درآمد فروش
          </h2>
          <p className="mt-0.5 text-[12.5px] text-gray-500">
            {rangeLabel} نسبت به دوره قبل
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="text-gray-500">درآمد</span>
          </span>
        </div>
      </div>

      {/* خلاصه سریع */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>
          مجموع: <span className="font-semibold text-gray-700">{totalRevenue.toLocaleString("fa-IR")} تومان</span>
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span>
          میانگین روزانه: <span className="font-semibold text-gray-700">{avgRevenue.toLocaleString("fa-IR")} تومان</span>
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span>
          سفارشات: <span className="font-semibold text-gray-700">{totalOrders}</span>
        </span>
      </div>

      <div className="mt-4 h-64 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueSeries}
            margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#eceaf3"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9997ab", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9997ab", fontSize: 12 }}
              tickFormatter={(v) => {
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                return String(v);
              }}
              width={45}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e0e3ff", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2.25}
              fill="url(#revFill)"
              isAnimationActive={true}
              animationDuration={800}
              activeDot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* اطلاعات پایین نمودار */}
      <div className="mt-3 flex justify-between text-[11px] text-gray-400">
        <span>پایان هفته</span>
        <span>شروع هفته</span>
      </div>
    </div>
  );
}