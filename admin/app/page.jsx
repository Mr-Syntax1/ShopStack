"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import GreetingHeader from "@/components/GreetingHeader";
import LiveTicker from "@/components/LiveTicker";
import StatsGrid from "@/components/StatsGrid";
import RevenueChart from "@/components/RevenueChart";
import OrderStatusDonut from "@/components/OrderStatusDonut";
import RecentOrders from "@/components/RecentOrders";
import TopProducts from "@/components/TopProducts";

export default function DashboardHome() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ===== سایدبار ===== */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ===== محتوای اصلی ===== */}
      <main className="lg:mr-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* هدر با دکمه همبرگر */}
            <div className="flex items-center justify-between">
              {/* دکمه همبرگر - فقط در موبایل */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex h-10 w-10 z-20 fixed items-center justify-center rounded-lg text-gray-600 transition-all bg-white hover:bg-gray-100 lg:hidden cursor-pointer mt-10"
                aria-label="باز کردن منو"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* فضای خالی برای هم‌ترازی */}
              <div className="w-10 lg:hidden" />
            </div>

            {/* عنوان صفحه در موبایل */}
            <h1 className="text-xl mx-auto font-bold text-gray-800 lg:hidden ">پنل مدیریت</h1>
            {/* هدر خوش‌آمدگویی */}
            <GreetingHeader />

            {/* تیکر زنده */}
            <LiveTicker />

            {/* کارت‌های آمار */}
            <StatsGrid />

            {/* نمودارها */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <OrderStatusDonut />
            </div>

            {/* سفارشات اخیر و محصولات برتر */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RecentOrders />
              </div>
              <TopProducts />
            </div>
          </div>

          {/* ===== فوتر ===== */}
          <footer className="mt-8 sm:mt-10 flex flex-col items-center justify-between gap-2 border-t border-gray-200/80 py-6 text-[12.5px] text-gray-400 sm:flex-row">
            <p>© 2026 Online Shop, Inc.</p>
            <p>آخرین بروزرسانی: لحظاتی پیش</p>
          </footer>
        </div>
      </main>
    </div>
  );
}