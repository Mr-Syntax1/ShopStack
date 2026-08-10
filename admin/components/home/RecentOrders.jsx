"use client";

import Link from "next/link";
import { recentOrders } from "@/lib/mock-data";

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

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export default function RecentOrders() {
  // محاسبه مجموع برای نمایش
  const totalAmount = recentOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-[15px] text-gray-800">
            سفارشات اخیر
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
          مجموع: <span className="font-semibold text-gray-700">${totalAmount.toFixed(2)}</span>
        </span>
        <span className="w-px h-4 bg-gray-200" />
        <span>
          تعداد: <span className="font-semibold text-gray-700">{recentOrders.length}</span>
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
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-[11px] text-indigo-700">
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
                  ${order.amount.toFixed(2)}
                </td>
              </tr>
            ))}
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