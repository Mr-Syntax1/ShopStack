"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getDashboardData } from "@/lib/dashboard-api";

// Tooltip سفارشی
const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = total > 0 ? Math.round((data.value / total) * 100) : 0;

    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/80 px-4 py-3 text-sm ">
        <p className="font-bold text-gray-800">{data.name}</p>
        <p className="text-gray-600">
          تعداد: <span className="font-semibold">{data.value}</span>
        </p>
        <p className="text-gray-600 ">
          درصد: <span className="font-semibold">{percent}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrderStatusDonut() {
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setOrderStatus(data?.orderStatus || []);
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = orderStatus.reduce((sum, s) => sum + (s.value || 0), 0);

  // داده‌های با رنگ‌بندی جدید
  const statusData = orderStatus.map((s) => ({
    ...s,
    color: s.color || "#4f46e5",
  }));

  if (loading) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
        <div className="mx-auto mt-2 h-44 w-44 bg-gray-100 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
      <h2 className="font-bold text-[15px] text-gray-800">
        وضعیت سفارشات
      </h2>
      <p className="mt-0.5 text-[12.5px] text-gray-500">
        {total.toLocaleString("fa-IR")} سفارش این ماه
      </p>

      <div className="relative mx-auto mt-2 h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationDuration={800}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  className="transition-opacity duration-300 cursor-pointer"
                  opacity={hoveredIndex !== null && hoveredIndex !== index ? 0.5 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip total={total} />}
              wrapperStyle={{ zIndex: 9999 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* مرکز دایره */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-[22px] text-gray-800">
            {statusData.length > 0 ? Math.round((statusData[0]?.value || 0) / total * 100) : 0}%
          </span>
          <span className="text-[11px] text-gray-400">تحویل شده</span>
        </div>
      </div>

      {/* لیست وضعیت‌ها */}
      <div className="mt-5 flex flex-col gap-2.5">
        {statusData.map((s) => (
          <div key={s.name} className="flex items-center justify-between group cursor-default">
            <span className="flex items-center gap-2 text-[13px] text-gray-600">
              <span
                className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: s.color }}
              />
              {s.name}
            </span>
            <span className="font-semibold text-[13px] text-gray-800">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
