// app/layout.jsx
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'پنل مدیریت',
  description: 'پنل مدیریت فروشگاه',
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