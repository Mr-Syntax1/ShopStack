import { CartProvider } from "@/context/CartContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AOSProvider from "../components/AOSProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL),
  title: {
    default: "OnlineShop | فروشگاه آنلاین",
  },
  description: "فروشگاه آنلاین OnlineShop - بهترین و جدیدترین محصولات دیجیتال با قیمت مناسب و ارسال سریع",
  keywords: "فروشگاه آنلاین، خرید اینترنتی، محصولات دیجیتال، قیمت مناسب، ارسال سریع",
  authors: [{ name: "OnlineShop Team" }],
  creator: "OnlineShop",
  publisher: "OnlineShop",
  robots: "index, follow",

  // ============================================
  // Open Graph (برای تلگرام، واتساپ، فیسبوک)
  // ============================================
  openGraph: {
    title: "OnlineShop | فروشگاه آنلاین",
    description: "بهترین و جدیدترین محصولات دیجیتال با قیمت مناسب و ارسال سریع",
    url: process.env.NEXT_PUBLIC_API_URL,
    siteName: "OnlineShop",
    images: [
      {
        url: "/images/logo.png", // ← مسیر تصویر در public
        width: 1200,
        height: 630,
        alt: "OnlineShop | فروشگاه آنلاین"
      }
    ],
    locale: "fa_IR",
    type: "website",
  },

  // ============================================
  // Twitter Card (برای توییتر)
  // ============================================
  twitter: {
    card: "summary_large_image",
    title: "OnlineShop | فروشگاه آنلاین",
    description: "بهترین و جدیدترین محصولات دیجیتال با قیمت مناسب و ارسال سریع",
    images: ["/images/logo.png"],
  },

  // ============================================
  // سایر متا تگ‌ها
  // ============================================
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  // verification: {
  //   google: "google-site-verification-code", // کد تأیید گوگل
  // },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className="h-full antialiased"
    >

      <body className="min-h-full flex flex-col font-sans">
        <AOSProvider />
        <CartProvider>
          <AuthProvider>
            <Header />
            <Toaster
              position="bottom-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </CartProvider>
      </body>
    </html >
  );
}