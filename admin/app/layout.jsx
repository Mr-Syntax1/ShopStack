import "./globals.css";

export const metadata = {
  title: "پنل مدیریت | OnlineShop",
  description: "مدیریت فروشگاه OnlineShop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50/50 min-h-screen">
        <div className="flex">
          {/* سایدبار (بعداً اضافه میشه) */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
