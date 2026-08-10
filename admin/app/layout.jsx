import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";

export const metadata = {
  title: "پنل مدیریت | OnlineShop",
  description: "مدیریت فروشگاه OnlineShop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-gray-50/50">
        <SidebarWrapper />
        <main className="lg:mr-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}