"use client";

import { useState, useEffect } from "react";
import { getDashboardData } from "@/lib/dashboard-api";

export default function TopProducts({ range = '7days', refreshKey = 0 }) {
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData(range, refreshKey > 0);
        setTopProducts(data?.topProducts || []);
        setLowStock(data?.lowStock || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range, refreshKey]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* محصولات برتر */}
      <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
        <h2 className="font-bold text-[15px] text-gray-800">
          محصولات برتر
        </h2>
        <p className="mt-0.5 text-[12.5px] text-gray-500">
          بر اساس تعداد فروش — درصد از کل فروش فروشگاه
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {topProducts.map((p, i) => (
            <div key={p.name} className="group">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13px] font-medium text-gray-800">
                  <span className="text-[11px] text-gray-400 font-medium w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.name}
                </span>

                <span className="shrink-0 pl-2 flex items-center gap-2 text-[12.5px]">
                  <span className="font-semibold text-gray-500">
                    {p.sold} فروش
                  </span>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
                    {p.realShare}%
                  </span>
                </span>
              </div>

              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
                  style={{ width: `${p.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* موجودی کم */}
      <div className="rounded-2xl border border-amber-200/50 bg-amber-50/60 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-[13.5px] font-semibold text-gray-800">
            موجودی رو به اتمام
          </h3>
          <span className="text-[10px] bg-amber-200/50 text-amber-700 px-1.5 py-0.5 rounded-full font-medium mr-auto">
            نیاز به سفارش
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {lowStock.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-[13px] p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <span className="text-gray-600">
                {item.name}{" "}
                <span className="text-gray-400">· {item.size}</span>
              </span>
              <span className="font-semibold text-amber-600">
                {item.left} عدد باقی
              </span>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}