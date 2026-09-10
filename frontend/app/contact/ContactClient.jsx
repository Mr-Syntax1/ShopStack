'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Accordion from "@/components/Accordion";
import { toast } from 'react-hot-toast'

//تعریف اعتبار با yup
const contactSchema = yup.object({
    name: yup
        .string()
        .required('نام و نام خانوادگی الزامی است')
        .min(3, 'نام باید حداقل 3 کاراکتر باشد')
        .max(50, 'نام حداکثر 50 کاراکتر باشد'),

    email: yup
        .string()
        .required('ایمل الزامی است')
        .email('ایمیل معتبر نیست')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'ایمیل معتبر نیست'),

    phone: yup
        .string()
        .required('شماره تماس الزامی است')
        .matches(/^09[0-9]{9}$/, 'شماره تماس باید با 09 شروع شود و 11 رقم باشد'),

    subject: yup
        .string()
        .required('موضوع پیام الزامی است')
        .min(4, 'موضوع باید حداقل 4 کاراکتر باشد')
        .max(100, 'موضوع حداکثر 100 کاراکتر باشد'),

    message: yup
        .string()
        .required('متن پیام الزامی است')
        .min(10, 'متن پیام باید حداقل ۱۰ کاراکتر باشد')
        .max(500, 'متن پیام حداکثر ۵۰۰ کاراکتر باشد'),
})

function ContactClient() {
    const [openId, setOpenId] = useState(null);

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? null : id);
    };

    // استفاده از react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        }
    })

    //تابع ارسال فرم
    const onSubmit = async (data) => {
        console.log('فرم ارسال شد:', data)

        // اینجا می‌تونی API رو بزنی
        // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })

        // نمایش نوتیفیکیشن موفقیت
        toast.success('پیام شما با موفقیت ارسال شد! به زودی با شما تماس می‌گیریم.', {
            duration: 7000,
            position: 'bottom-left',
            icon: '✅',
            style: {
                background: '#10b981',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '16px',
                direction: 'rtl',
            },
        })

        // پاک کردن فرم
        reset()
    }

    // اطلاعات تماس
    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "آدرس",
            details: ["تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲"]
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: "تلفن‌های تماس",
            details: ["۰۲۱-۱۲۳۴۵۶۷۸", "۰۲۱-۸۷۶۵۴۳۲۱", "۰۹۱۲-۳۴۵-۶۷۸۹"]
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: "ایمیل",
            details: ["info@samshop.com", "support@samshop.com", "sales@samshop.com"]
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "ساعات کاری",
            details: ["شنبه تا چهارشنبه: ۹ صبح تا ۱۸", "پنجشنبه: ۹ صبح تا ۱۳", "جمعه: تعطیل"]
        }
    ];

    const socials = [
        {
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            ),
            label: "اینستاگرام",
            color: "from-pink-500 to-orange-400"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            ),
            label: "تلگرام",
            color: "from-blue-500 to-cyan-400"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            label: "واتساپ",
            color: "from-green-500 to-emerald-400"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            label: "توییتر",
            color: "from-blue-400 to-indigo-500"
        }
    ];

    const faqData = [
        {
            id: 1,
            question: "چگونه می‌توانم سفارش خود را پیگیری کنم؟",
            answer: "بعد از ثبت سفارش، کد رهگیری برای شما پیامک می‌شود و می‌توانید از طریق پنل کاربری سفارشتان را پیگیری کنید."
        },
        {
            id: 2,
            question: "هزینه ارسال چقدر است؟",
            answer: "هزینه ارسال برای خرید‌های بالای ۵۰۰ هزار تومان رایگان است. در غیر این صورت ۳۵ هزار تومان می‌باشد."
        },
        {
            id: 3,
            question: "زمان تحویل سفارش چقدر است؟",
            answer: "سفارشات در تهران ۲۴ ساعته و در شهرستان‌ها ۳ تا ۵ روز کاری تحویل داده می‌شوند."
        },
        {
            id: 4,
            question: "چگونه می‌توانم کالا را مرجوع کنم؟",
            answer: "شما تا ۷ روز پس از تحویل سفارش، می‌توانید کالا را با شرایط مشخص شده مرجوع کنید."
        },
        {
            id: 5,
            question: "روش‌های پرداخت چیست؟",
            answer: "پرداخت آنلاین از طریق درگاه بانکی، کارت به کارت و پرداخت در محل (فقط تهران)."
        },
        {
            id: 6,
            question: "چگونه از تخفیف‌ها استفاده کنم؟",
            answer: "کد تخفیف را در صفحه سبد خرید وارد کنید و از خرید خود لذت ببرید."
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-26">

                {/* هدر صفحه */}
                <div className="relative text-center mb-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
                        <div className="w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-20" />
                    </div>

                    <div className="relative" data-aos="fade-up" data-aos-once="true" data-aos-delay="100">
                        <span
                            className="inline-block text-sm font-semibold text-purple-600 bg-purple-50/80 backdrop-blur-sm px-5 py-2 rounded-full mb-4 border border-purple-100/50"
                        >
                            ارتباط با ما
                        </span>
                        <h1
                            className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
                        >
                            تماس با <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">ما</span>
                        </h1>
                        <p
                            className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg"
                        >
                            ما همیشه آماده شنیدن نظرات و پاسخ به سوالات شما هستیم
                        </p>
                        <div
                            className="w-24 h-1 bg-linear-to-r from-purple-600 to-indigo-600 mx-auto rounded-full mt-4"
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* اطلاعات تماس - سمت راست */}
                    <div className="lg:col-span-1 space-y-6">
                        <div
                            data-aos="fade-up"
                            data-aos-duration="900"
                            data-aos-once="true"
                            className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">اطلاعات تماس</h2>
                            </div>

                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <div
                                        key={index}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                        data-aos-once="true"
                                        className="flex items-start gap-4 group"
                                    >
                                        <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                                            {item.details.map((detail, i) => (
                                                <p key={i} className="text-gray-500 text-sm">{detail}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* شبکه های اجتماعی */}
                        <div
                            data-aos="fade-left"
                            data-aos-duration="900"
                            data-aos-delay="150"
                            data-aos-once="true"
                            className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">شبکه‌های اجتماعی</h2>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {socials.map((social, index) => (
                                    <div key={index} className="text-center group cursor-pointer">
                                        <div className="w-14 h-14 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-purple-500/20 mx-auto">
                                            {social.icon}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">{social.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* نقشه ساده */}
                        <div
                            data-aos="fade-up"
                            data-aos-duration="900"
                            data-aos-delay="300"
                            data-aos-once="true"
                            className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100/50"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">موقعیت ما</h2>
                            </div>

                            {/* ✅ نقشه گوگل با iframe */}
                            <div className="rounded-2xl overflow-hidden h-48 border border-purple-100/50">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.5!2d51.3890!3d35.6997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491ff0c9b7%3A0x8a2d8e8e8e8e8e8e!2sTehran%2C%20Vanak%20Square!5e0!3m2!1sen!2s!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="نقشه گوگل"
                                />
                            </div>

                            <a
                                href="https://www.google.com/maps?q=Tehran+Vanak+Square"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center text-gray-400 text-xs mt-3 hover:text-purple-600 transition-colors"
                            >
                                مشاهده مسیر در گوگل مپ
                            </a>
                        </div>
                    </div>

                    {/* فرم تماس - سمت چپ */}
                    <div className="lg:col-span-2">
                        <div
                            data-aos="fade-right"
                            data-aos-duration="900"
                            data-aos-delay="200"
                            data-aos-once="true"
                            className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">ارسال پیام</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    {/* فیلد نام */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                                            نام و نام خانوادگی <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name')}
                                            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 bg-gray-50 hover:bg-white`}
                                            placeholder="امیر محمدی"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* فیلد ایمیل */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                                            ایمیل <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            {...register('email')}
                                            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 bg-gray-50 hover:bg-white`}
                                            placeholder="alireza@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    {/* فیلد تلفن */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                                            شماره تماس <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            {...register('phone')}
                                            className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 bg-gray-50 hover:bg-white`}
                                            placeholder="09123456789"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* فیلد موضوع */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                                            موضوع <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('subject')}
                                            className={`w-full border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 bg-gray-50 hover:bg-white`}
                                            placeholder="مشکل در سفارش، مشاوره خرید، ..."
                                        />
                                        {errors.subject && (
                                            <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* فیلد پیام */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                                        متن پیام <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        rows={6}
                                        className={`w-full border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-gray-800 bg-gray-50 hover:bg-white`}
                                        placeholder="پیام خود را بنویسید..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* دکمه ارسال */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-xl cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            در حال ارسال ...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            ارسال پیام
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* سوالات متداول */}
                <div
                    data-aos="fade-up"
                    data-aos-once="true"
                    className="mt-16 bg-white rounded-3xl shadow-xl p-6 pb-24 md:p-8 md:pb-24 border border-gray-100/50"
                >
                    <div className="text-center mb-12">
                        <span
                            className="inline-block text-sm font-semibold text-purple-600 bg-purple-50/80 px-5 py-2 rounded-full mb-4 border border-purple-100/50"
                        >
                            راهنمای سریع
                        </span>

                        <h2
                            className="text-4xl md:text-5xl font-bold text-gray-800"
                        >
                            سوالات <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">متداول</span>
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {faqData.map((item, index) => (
                            <div
                                key={item.id}
                            >
                                <Accordion
                                    id={item.id}
                                    question={item.question}
                                    answer={item.answer}
                                    isOpen={openId === item.id}
                                    onToggle={() => toggleAccordion(item.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ContactClient;