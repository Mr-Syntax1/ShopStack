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
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-xl font-bold text-gray-800 lg:hidden text-center">
        پنل مدیریت
      </h1>

      {/* هدر خوش‌آمدگویی */}
      <GreetingHeader
        range={activeRange}
        onRangeChange={setActiveRange}
        onRefresh={handleRefresh}
      />

      {/* تیکر زنده */}
      <LiveTicker range={activeRange} refreshKey={refreshKey} />

      {/* کارت‌های آمار */}
      <StatsGrid range={activeRange} refreshKey={refreshKey} />

      {/* نمودارها */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart range={activeRange} refreshKey={refreshKey} />
        </div>
        <OrderStatusDonut range={activeRange} refreshKey={refreshKey} />
      </div>

      {/* سفارشات اخیر و محصولات برتر */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders range={activeRange} refreshKey={refreshKey} />
        </div>
        <TopProducts range={activeRange} refreshKey={refreshKey} />
      </div>

      {/* فوتر */}
      <footer className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-2 border-t border-gray-200/80 py-6 text-[12.5px] text-gray-400 sm:flex-row text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Online Shop. تمام حقوق محفوظ است.
        </p>
      </footer>
    </div>
  );
}