"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard-api";
import { initials } from "@/lib/persian";

const statusStyles = {
  "تحویل شده": "bg-emerald-50 text-emerald-700",
  "در حال پردازش": "bg-indigo-50 text-indigo-700",
  "در انتظار": "bg-amber-50 text-amber-700",
  "لغو شده": "bg-rose-50 text-rose-700",
};

const statusLabels = {
  "تحویل شده": "تحویل شده",
  "در حال پردازش": "در حال پردازش",
  "در انتظار": "در انتظار",
  "لغو شده": "لغو شده",
};


const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-fuchsia-600',
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}


export default function RecentOrders({ range = '7days', refreshKey = 0 }) {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData(range, refreshKey > 0);
        setRecentOrders(data?.recentOrders || []);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range, refreshKey]);

  // محاسبه مجموع برای نمایش
  const totalAmount = recentOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-[15px] text-gray-800">
            {recentOrders.length} سفارش اخیر
          </h2>
          <p className="mt-0.5 text-[12.5px] text-gray-500">
            آخرین فعالیت‌های فروشگاه شما
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1 text-[12.5px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          مشاهده همه
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* خلاصه سریع */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>
          مجموع: <span className="font-semibold text-gray-700">{totalAmount.toLocaleString("fa-IR")} تومان</span>
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 text-right">
              <th className="pb-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 text-right">
                مشتری
              </th>
              <th className="pb-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 text-right">
                محصول
              </th>
              <th className="pb-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 text-right">
                وضعیت
              </th>
              <th className="pb-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 text-right">
                مبلغ
              </th>
            </tr>
          </thead>
          <tbody>
            {
              recentOrders.map((order) => {
                const avatarGradient = getAvatarGradient(order.customer);

                return (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex bg-linear-to-br ${avatarGradient} text-white h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-[11px]`}>
                          {initials(order.customer)}
                        </span>
                        <div>
                          <p className="text-[13.5px] font-medium text-gray-800">
                            {order.customer}
                          </p>
                          <p className="text-[11.5px] text-gray-400">
                            {order.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pl-4">
                      <p className="text-[13px] text-gray-600">
                        {order.product}
                      </p>
                      <p className="text-[11.5px] text-gray-400">{order.id}</p>
                    </td>
                    <td className="py-3 pl-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${statusStyles[order.status] || "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-[13.5px] text-gray-800">
                      {order.amount.toLocaleString("fa-IR")} تومان
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* در صورت نداشتن سفارش */}
      {recentOrders.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          هیچ سفارشی یافت نشد
        </div>
      )}
    </div>
  );
}