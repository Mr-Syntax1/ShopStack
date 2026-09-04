"use client";

import { useState } from "react";
import GreetingHeader from "@/components/home/GreetingHeader";
import LiveTicker from "@/components/home/LiveTicker";
import StatsGrid from "@/components/home/StatsGrid";
import RevenueChart from "@/components/home/RevenueChart";
import OrderStatusDonut from "@/components/home/OrderStatusDonut";
import RecentOrders from "@/components/home/RecentOrders";
import TopProducts from "@/components/home/TopProducts";

export default function DashboardHome() {
  const [activeRange, setActiveRange] = useState("7days");

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* عنوان صفحه در موبایل */}
      <h1 className="text-xl font-bold text-gray-800 lg:hidden text-center">
        پنل مدیریت
      </h1>

      {/* هدر خوش‌آمدگویی */}
      <GreetingHeader range={activeRange} onRangeChange={setActiveRange} />

      {/* تیکر زنده */}
      <LiveTicker />

      {/* کارت‌های آمار */}
      <StatsGrid range={activeRange} />

      {/* نمودارها */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart range={activeRange} />
        </div>
        <OrderStatusDonut range={activeRange} />
      </div>

      {/* سفارشات اخیر و محصولات برتر */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders range={activeRange} />
        </div>
        <TopProducts range={activeRange} />
      </div>

      {/* فوتر */}
      <footer className="mt-8 sm:mt-10 flex flex-col items-center justify-between gap-2 border-t border-gray-200/80 py-6 text-[12.5px] text-gray-400 sm:flex-row">
        <p>© 2026 Online Shop, Inc.</p>
        <p>آخرین بروزرسانی: لحظاتی پیش</p>
      </footer>
    </div>
  );
}