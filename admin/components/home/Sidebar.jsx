'use client';

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserInfo from "@/components/UserInfo";

// ==============================
// آیتم‌های منو
// ==============================
const menuItems = [
  {
    label: "داشبورد",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    href: "/dashboard",
    exact: true, // ← فقط خود مسیر دقیق
  },
  {
    label: "سفارشات",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    href: "/dashboard/orders",
  },
  {
    label: "محصولات",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    href: "/dashboard/products",
  },
  {
    label: "مشتریان",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    href: "/dashboard/customers",
  },
  // {
  //   label: "تحلیل",
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  //     </svg>
  //   ),
  //   href: "/dashboard/analytics",
  // },
  {
    label: "تنظیمات",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: "/dashboard/settings",
  },
];

// ==============================
// کامپوننت اسکلتون برای لودینگ
// ==============================
function UserInfoSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80">
      <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-28 animate-pulse" />
      </div>
      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

// ==============================
// کامپوننت اصلی سایدبار
// ==============================
export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // ==============================
  // تابع بررسی فعال بودن لینک
  // ==============================
  const isLinkActive = (item) => {
    // اگر exact: true باشد، فقط مسیر دقیقاً برابر باشد
    if (item.exact) {
      return pathname === item.href;
    }

    // برای بقیه موارد: اگر مسیر با href شروع شود (و خود href نباشد)
    // و یا دقیقاً برابر باشد
    return pathname === item.href ||
      (pathname?.startsWith(item.href) && pathname !== item.href);
  };

  return (
    <>
      {/* اورلی (overlay) - فقط در موبایل */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* سایدبار */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-gray-200/80 bg-white transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* ============================== */}
        {/* هدر - لوگو و دکمه بستن */}
        {/* ============================== */}
        <div className="flex items-center justify-between gap-2.5 px-6 py-5 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 5.5L8 2l6 3.5M2 5.5v6L8 15m-6-9.5L8 9m6-3.5v6L8 15m6-9.5L8 9m0 0v6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-gray-800">
              پنل مدیریت
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ============================== */}
        {/* منو - استاتیک */}
        {/* ============================== */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = isLinkActive(item);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 ${isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <span className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 pt-4 border-t border-gray-200/60">
          <Link
            href="http://localhost:3000"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            مشاهده فروشگاه
          </Link>
        </div>

        {/* ============================== */}
        {/* پایین سایدبار - داینامیک با Suspense */}
        {/* ============================== */}
        <div className="p-4 border-t border-gray-200/80">
          <Suspense fallback={<UserInfoSkeleton />}>
            <UserInfo />
          </Suspense>
        </div>
      </aside>
    </>
  );
}