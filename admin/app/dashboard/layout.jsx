import "../globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import { AdminReadOnlyProvider } from "@/lib/AdminReadOnlyContext";
import { isAdminReadOnly } from "@/lib/adminAccess";

export const metadata = {
  title: "پنل مدیریت | OnlineShop",
  description: "مدیریت فروشگاه OnlineShop",
};

const readOnly = isAdminReadOnly();

export default function RootLayout({ children }) {
  return (
    <AdminReadOnlyProvider isReadOnly={readOnly}>
      <div className="">
        {readOnly && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
            <p className="text-sm font-semibold text-amber-800">
              ⚠️ وضعیت فقط خواندنی — تغییرات روی داده‌ها در این محیط به خاطر سطح دسترسی امکان‌پذیر نیست.
            </p>
          </div>
        )}
        <SidebarWrapper />
        <main className="lg:mr-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </div>
    </AdminReadOnlyProvider>
  );
}