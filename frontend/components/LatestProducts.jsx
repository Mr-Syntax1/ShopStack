'use client'
import Link from 'next/link';
import Image from 'next/image';
import Productlist from './ProductList';

const products = [
    {
        id: 1,
        title: 'هدفون بیسیم اپل AirPods Pro 2',
        price: 8500000,
        description: 'هدفون بیسیم اپل با قابلیت حذف نویز فعال، کیفیت صدای فوق‌العاده و باتری ۲۴ ساعته. مناسب برای موسیقی و مکالمات روزانه',
        category: 'لوازم جانبی',
        subCategory: 'هدفون',
        image: '/images/products/airPod.webp',
        rating: 4.8,
        reviews: 215,
        stock: 20,
        discount: 5,
        brand: 'اپل',
        tags: ['بیسیم', 'حذف نویز', 'کیفیت بالا'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 2,
        title: 'ساعت هوشمند اپل واچ سری ۸',
        price: 28000000,
        description: 'ساعت هوشمند اپل با نمایشگر همیشه روشن، حسگر ضربان قلب، اکسیژن خون و قابلیت اندازه‌گیری ECG. مناسب برای ورزش و سلامتی',
        category: 'پوشیدنی',
        subCategory: 'ساعت هوشمند',
        image: '/images/products/appleWatch1.webp',
        rating: 4.9,
        reviews: 312,
        stock: 8,
        discount: 10,
        brand: 'اپل',
        tags: ['پوشیدنی', 'سلامتی', 'ورزش'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 3,
        title: 'ساعت هوشمند اپل واچ SE',
        price: 18000000,
        description: 'ساعت هوشمند اقتصادی اپل با ویژگی‌های ضروری شامل ردیابی فعالیت، ضربان قلب و نمایشگر Retina. گزینه‌ای عالی برای شروع',
        category: 'پوشیدنی',
        subCategory: 'ساعت هوشمند',
        image: '/images/products/appleWatch2.webp',
        rating: 4.6,
        reviews: 178,
        stock: 15,
        discount: 0,
        brand: 'اپل',
        tags: ['اقتصادی', 'ورزش', 'سلامتی'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 4,
        title: 'کنسول بازی PS5 Slim',
        price: 35000000,
        description: 'کنسول نسل جدید سونی با گرافیک ۴K، سرعت فوق‌العاده و کتابخانه عظیم بازی‌های انحصاری. بهترین تجربه گیمینگ',
        category: 'گیمینگ',
        subCategory: 'کنسول',
        image: '/images/products/console1.webp',
        rating: 4.9,
        reviews: 425,
        stock: 5,
        discount: 0,
        brand: 'سونی',
        tags: ['گیمینگ', '۴K', 'حرفه‌ای'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 5,
        title: 'کنسول بازی Xbox Series X',
        price: 32000000,
        description: 'قدرتمندترین کنسول مایکروسافت با پردازنده ۱۲ ترافلاپس، پشتیبانی از بازی‌های ۴K و سرویس Game Pass',
        category: 'گیمینگ',
        subCategory: 'کنسول',
        image: '/images/products/console2.webp',
        rating: 4.7,
        reviews: 289,
        stock: 6,
        discount: 5,
        brand: 'مایکروسافت',
        tags: ['گیمینگ', '۴K', 'Game Pass'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 6,
        title: 'کنسول بازی نینتندو سوییچ OLED',
        price: 15000000,
        description: 'کنسول هیبریدی نینتندو با صفحه نمایش OLED ۷ اینچی، بازی‌های انحصاری فوق‌العاده و قابلیت حمل‌آسان',
        category: 'گیمینگ',
        subCategory: 'کنسول',
        image: '/images/products/console3.webp',
        rating: 4.8,
        reviews: 198,
        stock: 12,
        discount: 0,
        brand: 'نینتندو',
        tags: ['قابل حمل', 'OLED', 'خانوادگی'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 7,
        title: 'کیس گیمینگ کولر مستر MasterBox',
        price: 4500000,
        description: 'کیس گیمینگ با طراحی شیشه‌ای، ۴ فن RGB و سیستم مدیریت کابل پیشرفته. مناسب برای سیستم‌های حرفه‌ای',
        category: 'قطعات کامپیوتر',
        subCategory: 'کیس',
        image: '/images/products/gameing1.webp',
        rating: 4.5,
        reviews: 76,
        stock: 10,
        discount: 15,
        brand: 'کولر مستر',
        tags: ['گیمینگ', 'RGB', 'خنک‌کننده'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 8,
        title: 'فن‌های RGB کولر مستر MasterFan',
        price: 1200000,
        description: 'مجموعه ۳ فن RGB با کنترلر، نورپردازی قابل تنظیم و صدای کم. بهبود جریان هوا و زیبایی سیستم',
        category: 'قطعات کامپیوتر',
        subCategory: 'فن',
        image: '/images/products/gameing2.webp',
        rating: 4.3,
        reviews: 54,
        stock: 25,
        discount: 0,
        brand: 'کولر مستر',
        tags: ['RGB', 'خنک‌کننده', 'بی‌صدا'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 9,
        title: 'هدفون گیمینگ ریزر Kraken',
        price: 3500000,
        description: 'هدفون گیمینگ با صدای ۷.۱ فراگیر، میکروفون خم‌شونده و نورپردازی RGB. مناسب برای بازی‌های رقابتی',
        category: 'لوازم جانبی',
        subCategory: 'هدفون',
        image: '/images/products/headphone.webp',
        rating: 4.4,
        reviews: 134,
        stock: 18,
        discount: 10,
        brand: 'ریزر',
        tags: ['گیمینگ', 'RGB', 'صدای فراگیر'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 10,
        title: 'لپ‌تاپ ایسوس TUF Gaming A15',
        price: 32000000,
        description: 'لپ‌تاپ گیمینگ با پردازنده AMD Ryzen 7، کارت گرافیک RTX 4060 و صفحه نمایش ۱۴۴ هرتز. مناسب برای گیمینگ و برنامه‌نویسی',
        category: 'الکترونیک',
        subCategory: 'لپ‌تاپ',
        image: '/images/products/labtop1.webp',
        rating: 4.7,
        reviews: 156,
        stock: 8,
        discount: 8,
        brand: 'ایسوس',
        tags: ['گیمینگ', 'AMD', 'حرفه‌ای'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 11,
        title: 'لپ‌تاپ ایسوس Vivobook 15',
        price: 18000000,
        description: 'لپ‌تاپ فوق‌باریک با پردازنده Intel Core i5، صفحه نمایش OLED و باتری با دوام بالا. مناسب برای کار و تحصیل',
        category: 'الکترونیک',
        subCategory: 'لپ‌تاپ',
        image: '/images/products/labtop2.webp',
        rating: 4.5,
        reviews: 98,
        stock: 12,
        discount: 12,
        brand: 'ایسوس',
        tags: ['باریک', 'OLED', 'اداری'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 12,
        title: 'لپ‌تاپ ایسوس Zenbook Duo',
        price: 45000000,
        description: 'لپ‌تاپ دو صفحه‌ای ایسوس با نمایشگر ثانویه لمسی، پردازنده Intel Core i9 و طراحی فوق‌حرفه‌ای. مناسب برای تولید محتوا',
        category: 'الکترونیک',
        subCategory: 'لپ‌تاپ',
        image: '/images/products/labtop3.webp',
        rating: 4.9,
        reviews: 67,
        stock: 3,
        discount: 0,
        brand: 'ایسوس',
        tags: ['دو صفحه‌ای', 'حرفه‌ای', 'تولید محتوا'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 13,
        title: 'مانیتور ۴K سامسونگ ۲۸ اینچ',
        price: 22000000,
        description: 'مانیتور ۴K با کیفیت فوق‌العاده، مناسب برای طراحی، برنامه‌نویسی و تماشای فیلم. دارای فناوری HDR و نرخ بروزرسانی ۶۰ هرتز',
        category: 'الکترونیک',
        subCategory: 'مانیتور',
        image: '/images/products/manitor1.webp',
        rating: 4.6,
        reviews: 89,
        stock: 7,
        discount: 5,
        brand: 'سامسونگ',
        tags: ['۴K', 'طراحی', 'HDR'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 14,
        title: 'مانیتور گیمینگ سامسونگ ۳۲ اینچ منحنی',
        price: 28000000,
        description: 'مانیتور گیمینگ منحنی با نرخ بروزرسانی ۱۴۴ هرتز، رزولوشن ۲K و تکنولوژی FreeSync. تجربه‌ای غوطه‌ورکننده',
        category: 'الکترونیک',
        subCategory: 'مانیتور',
        image: '/images/products/manitor2.webp',
        rating: 4.8,
        reviews: 134,
        stock: 5,
        discount: 10,
        brand: 'سامسونگ',
        tags: ['گیمینگ', 'منحنی', '۱۴۴ هرتز'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 15,
        title: 'مانیتور سامسونگ ۲۴ اینچ',
        price: 9500000,
        description: 'مانیتور اقتصادی با کیفیت Full HD، طراحی باریک و مصرف انرژی پایین. مناسب برای استفاده روزانه',
        category: 'الکترونیک',
        subCategory: 'مانیتور',
        image: '/images/products/manitor3.webp',
        rating: 4.2,
        reviews: 67,
        stock: 15,
        discount: 0,
        brand: 'سامسونگ',
        tags: ['اقتصادی', 'Full HD', 'اداری'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 16,
        title: 'مانیتور سامسونگ ۲۷ اینچ ۴K',
        price: 25000000,
        description: 'مانیتور حرفه‌ای ۴K با دقت رنگ بالا، مناسب برای تدوین ویدئو و طراحی گرافیک. دارای پورت‌های متنوع',
        category: 'الکترونیک',
        subCategory: 'مانیتور',
        image: '/images/products/manitor4.webp',
        rating: 4.7,
        reviews: 78,
        stock: 6,
        discount: 0,
        brand: 'سامسونگ',
        tags: ['۴K', 'حرفه‌ای', 'تدوین'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 17,
        title: 'مانیتور سامسونگ ۳۴ اینچ اولترا واید',
        price: 38000000,
        description: 'مانیتور اولترا واید ۳۴ اینچ با رزولوشن ۴K، نسبت تصویر ۲۱:۹ و قابلیت کار همزمان چندین پنجره. ایده‌آل برای معامله‌گری و برنامه‌نویسی',
        category: 'الکترونیک',
        subCategory: 'مانیتور',
        image: '/images/products/manitor5.webp',
        rating: 4.9,
        reviews: 56,
        stock: 4,
        discount: 15,
        brand: 'سامسونگ',
        tags: ['اولترا واید', '۴K', 'برنامه‌نویسی'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 18,
        title: 'گوشی سامسونگ گلکسی S24 Ultra',
        price: 45000000,
        description: 'پرچمدار سامسونگ با دوربین ۲۰۰ مگاپیکسلی، نمایشگر ۶.۸ اینچی AMOLED و باتری ۵۰۰۰ میلی‌آمپر. بهترین گوشی اندرویدی سال',
        category: 'موبایل',
        subCategory: 'گوشی',
        image: '/images/products/mobile1.webp',
        rating: 4.9,
        reviews: 512,
        stock: 8,
        discount: 5,
        brand: 'سامسونگ',
        tags: ['پرچمدار', 'دوربین عالی', 'امنیت بالا'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 19,
        title: 'گوشی اپل آیفون ۱۵ پرو مکس',
        price: 52000000,
        description: 'پرچمدار اپل با تراشه A17 Pro، دوربین تتراپیکسل ۴۸ مگاپیکسلی و نمایشگر ۶.۷ اینچی ProMotion. قدرت بی‌نظیر',
        category: 'موبایل',
        subCategory: 'گوشی',
        image: '/images/products/mobile2.webp',
        rating: 4.9,
        reviews: 687,
        stock: 5,
        discount: 0,
        brand: 'اپل',
        tags: ['پرچمدار', 'A17 Pro', 'حرفه‌ای'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 20,
        title: 'گوشی شیائومی ۱۴ پرو',
        price: 22000000,
        description: 'گوشی پرچمدار اقتصادی با دوربین لایکا ۵۰ مگاپیکسلی، نمایشگر ۶.۷ اینچی AMOLED و باتری ۵۰۰۰ میلی‌آمپر',
        category: 'موبایل',
        subCategory: 'گوشی',
        image: '/images/products/mobile3.webp',
        rating: 4.6,
        reviews: 234,
        stock: 15,
        discount: 12,
        brand: 'شیائومی',
        tags: ['اقتصادی', 'دوربین لایکا', 'ارزش خرید'],
        createdAt: new Date('2026-05-29')
    },
    {
        id: 21,
        title: 'سی‌دی بازی های عصر جدید',
        price: 450000,
        description: 'مجموعه ۵ سی‌دی از بهترین بازی‌های سال ۲۰۲۶ شامل عناوین اکشن، ماجراجویی و مسابقه‌ای',
        category: 'بازی',
        subCategory: 'سی‌دی',
        image: '/images/products/cd1.webp',
        rating: 4.4,
        reviews: 89,
        stock: 30,
        discount: 0,
        brand: 'متفرقه',
        tags: ['بازی', 'اکشن', 'ماجراجویی'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 22,
        title: 'سی‌دی بازی های کلاسیک',
        price: 350000,
        description: 'مجموعه ۳ سی‌دی از بازی‌های خاطره‌انگیز دهه ۸۰ و ۹۰ شامل سوپر ماریو، سونیک و استریت فایتر',
        category: 'بازی',
        subCategory: 'سی‌دی',
        image: '/images/products/cd2.webp',
        rating: 4.5,
        reviews: 112,
        stock: 25,
        discount: 10,
        brand: 'متفرقه',
        tags: ['کلاسیک', 'خاطره‌انگیز', 'بازی'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 23,
        title: 'سی‌دی بازی های کودکانه',
        price: 250000,
        description: 'مجموعه ۴ سی‌دی از بازی‌های آموزشی و سرگرم‌کننده برای کودکان ۶ تا ۱۲ سال',
        category: 'بازی',
        subCategory: 'سی‌دی',
        image: '/images/products/cd3.webp',
        rating: 4.2,
        reviews: 45,
        stock: 40,
        discount: 15,
        brand: 'متفرقه',
        tags: ['کودکانه', 'آموزشی', 'سرگرمی'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 24,
        title: 'سی‌دی بازی های ورزشی',
        price: 400000,
        description: 'مجموعه ۳ سی‌دی از بهترین بازی‌های ورزشی شامل فیفا، NBA و مسابقات ماشین‌رانی',
        category: 'بازی',
        subCategory: 'سی‌دی',
        image: '/images/products/cd4.webp',
        rating: 4.3,
        reviews: 67,
        stock: 20,
        discount: 0,
        brand: 'متفرقه',
        tags: ['ورزشی', 'فیفا', 'مسابقه‌ای'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 25,
        title: 'سی‌دی بازی های ماجراجویی',
        price: 380000,
        description: 'مجموعه ۴ سی‌دی از بازی‌های ماجراجویی و معمایی با داستان‌های جذاب',
        category: 'بازی',
        subCategory: 'سی‌دی',
        image: '/images/products/cd5.webp',
        rating: 4.6,
        reviews: 78,
        stock: 22,
        discount: 5,
        brand: 'متفرقه',
        tags: ['ماجراجویی', 'معمایی', 'داستانی'],
        createdAt: new Date('2026-04-25')
    },
    {
        id: 26,
        title: 'سی‌دی بازی های تیراندازی',
        price: 420000,
        description: 'مجموعه ۳ سی‌دی از بهترین بازی‌های تیراندازی و اکشن شامل Call of Duty و Battlefield',
        category: 'بازی',
        subCategory: 'سی‌دی',
        image: '/images/products/cd6.webp',
        rating: 4.7,
        reviews: 98,
        stock: 18,
        discount: 8,
        brand: 'متفرقه',
        tags: ['تیراندازی', 'اکشن', 'جنگی'],
        createdAt: new Date('2026-04-25')
    }
]

export default function LatestProducts() {
    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-blue-50/30 via-white to-indigo-50/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* هدر بخش با طراحی جدید */}
                <div className="relative mb-12 sm:mb-16">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100/70 px-5 py-2 rounded-full mb-4 backdrop-blur-sm border border-blue-200/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            جدیدترین محصولات
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
                            محصولات
                            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> پر فروش</span>
                        </h2>

                        <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
                            بهترین و محبوب‌ترین محصولات فروشگاه رو با بهترین قیمت تهیه کنید
                        </p>
                    </div>

                    {/* دکمه مشاهده همه - در هدر */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-blue-200/50"
                        >
                            مشاهده همه
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* لیست محصولات */}
                <Productlist products={products} />

                {/* آمار فروشگاه - فقط ۳ کارت ساده */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50">
                        <div className="w-14 h-14 mx-auto bg-blue-100/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors duration-300 mb-3">
                            📦
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                        <p className="text-sm text-gray-500">محصولات موجود</p>
                    </div>

                    <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50">
                        <div className="w-14 h-14 mx-auto bg-green-100/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-100 transition-colors duration-300 mb-3">
                            ✅
                        </div>
                        <p className="text-2xl font-bold text-green-600">۱۰۰%</p>
                        <p className="text-sm text-gray-500">کیفیت تضمینی</p>
                    </div>

                    <div className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50">
                        <div className="w-14 h-14 mx-auto bg-purple-100/50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-100 transition-colors duration-300 mb-3">
                            🚀
                        </div>
                        <p className="text-2xl font-bold text-purple-600">۲۴ ساعته</p>
                        <p className="text-sm text-gray-500">ارسال سریع</p>
                    </div>
                </div>
            </div>
        </section>
    );
}