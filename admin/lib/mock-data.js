// lib/mock-data.js

export const stats = [
  {
    label: "فروش کل",
    value: 48920,
    prefix: "",
    suffix: " تومان",
    delta: 12.4,
    trend: "up",
    spark: [12, 14, 13, 17, 16, 19, 22, 21, 25, 24, 27, 29],
  },
  {
    label: "سفارشات",
    value: 1284,
    prefix: "",
    delta: 8.1,
    trend: "up",
    spark: [30, 32, 28, 35, 34, 38, 36, 40, 42, 41, 45, 47],
  },
  {
    label: "مشتریان جدید",
    value: 356,
    prefix: "",
    delta: -3.2,
    trend: "down",
    spark: [20, 22, 24, 21, 19, 20, 18, 17, 19, 16, 15, 14],
  },
  {
    label: "نرخ تبدیل",
    value: 3.8,
    suffix: "%",
    prefix: "",
    delta: 0.6,
    trend: "up",
    spark: [3.1, 3.2, 3.0, 3.4, 3.3, 3.5, 3.6, 3.5, 3.7, 3.6, 3.7, 3.8],
  },
];

export const revenueSeries = [
  { day: "شنبه", revenue: 4200, orders: 88 },
  { day: "یکشنبه", revenue: 5100, orders: 102 },
  { day: "دوشنبه", revenue: 4780, orders: 95 },
  { day: "سه‌شنبه", revenue: 6300, orders: 121 },
  { day: "چهارشنبه", revenue: 7150, orders: 138 },
  { day: "پنجشنبه", revenue: 8420, orders: 162 },
  { day: "جمعه", revenue: 6980, orders: 140 },
];

export const orderStatus = [
  { name: "تحویل شده", value: 812, color: "#4f46e5" },
  { name: "در حال پردازش", value: 246, color: "#7c74f5" },
  { name: "در انتظار", value: 158, color: "#c7c3fb" },
  { name: "لغو شده", value: 68, color: "#eceaf3" },
];

export const recentOrders = [
  {
    id: "#OS-3392",
    customer: "آملیا هارت",
    location: "برلین، آلمان",
    product: "هدفون بی‌سیم پرو",
    amount: 129.0,
    status: "تحویل شده",
    date: "۹ مرداد",
  },
  {
    id: "#OS-3391",
    customer: "مارکوس چن",
    location: "آستین، آمریکا",
    product: "کفش اسپرت رانر ایکس",
    amount: 96.5,
    status: "در حال پردازش",
    date: "۹ مرداد",
  },
  {
    id: "#OS-3390",
    customer: "سوفیا ریچی",
    location: "میلان، ایتالیا",
    product: "ست قهوه‌سازی سرامیکی",
    amount: 58.0,
    status: "در انتظار",
    date: "۸ مرداد",
  },
  {
    id: "#OS-3389",
    customer: "لیام اوکانر",
    location: "دوبلین، ایرلند",
    product: "کیف مسافرتی آخر هفته",
    amount: 142.0,
    status: "تحویل شده",
    date: "۸ مرداد",
  },
  {
    id: "#OS-3388",
    customer: "نور حداد",
    location: "دبی، امارات",
    product: "چراغ رومیزی - گردویی",
    amount: 74.0,
    status: "لغو شده",
    date: "۷ مرداد",
  },
  {
    id: "#OS-3387",
    customer: "النا پترووا",
    location: "ورشو، لهستان",
    product: "هدفون بی‌سیم پرو",
    amount: 129.0,
    status: "تحویل شده",
    date: "۷ مرداد",
  },
];

export const topProducts = [
  { name: "هدفون بی‌سیم پرو", sold: 412, revenue: 53148, share: 92 },
  { name: "کفش اسپرت رانر ایکس", sold: 298, revenue: 28771, share: 74 },
  { name: "کیف مسافرتی آخر هفته", sold: 187, revenue: 26554, share: 58 },
  { name: "ست قهوه‌سازی سرامیکی", sold: 165, revenue: 9570, share: 41 },
  { name: "چراغ رومیزی - گردویی", sold: 96, revenue: 7104, share: 24 },
];

export const lowStock = [
  { name: "کفش اسپرت رانر ایکس", size: "سایز ۴۲", left: 4 },
  { name: "ست قهوه‌سازی سرامیکی", size: "استاندارد", left: 6 },
  { name: "چراغ رومیزی - گردویی", size: "—", left: 2 },
];

export const liveEvents = [
  "سفارش جدید #OS-3393 از تورنتو، کانادا · لحظاتی پیش",
  "سفارش آملیا هارت تحویل داده شد · ۲ دقیقه پیش",
  "کفش اسپرت رانر ایکس تنها ۴ عدد باقی مونده · ۶ دقیقه پیش",
  "سفارش جدید #OS-3392 از برلین، آلمان · ۹ دقیقه پیش",
  "پرداخت سفارش #OS-3390 دریافت شد · ۱۴ دقیقه پیش",
  "مشتری جدید از لاگوس، نیجریه ثبت‌نام کرد · ۱۸ دقیقه پیش",
];