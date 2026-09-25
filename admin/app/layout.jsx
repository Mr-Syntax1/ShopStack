// app/layout.jsx
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: {
    default: 'پنل مدیریت | ShopStack',
    template: '%s | پنل مدیریت ShopStack',
  },
  description: 'سیستم مدیریت محتوای پیشرفته فروشگاه آنلاین ShopStack - مدیریت محصولات، سفارشات، کاربران و گزارش‌ها',
  keywords: ['پنل مدیریت', 'فروشگاه آنلاین', 'مدیریت محصولات', 'سفارشات', 'گزارش‌های فروش', 'ShopStack'],
  authors: [{ name: 'ShopStack Team' }],
  creator: 'ShopStack',
  publisher: 'ShopStack',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://shop-stack-rqve.vercel.app',
    siteName: 'ShopStack Admin',
    title: 'پنل مدیریت ShopStack',
    description: 'سیستم مدیریت محتوای پیشرفته فروشگاه آنلاین ShopStack',
    images: [
      {
        url: '/images/admin2.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopStack Admin Panel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'پنل مدیریت ShopStack',
    description: 'سیستم مدیریت محتوای پیشرفته فروشگاه آنلاین ShopStack',
    images: ['/images/admin2.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-gray-50/50">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
