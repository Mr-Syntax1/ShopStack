// lib/toastHelpers.js
import { formatPrice } from "@/lib/persian";
import toast from "react-hot-toast";

// توست سفارشی برای افزودن به سبد خرید
export const showAddToCartToast = (product, t) => {
    const discountedPrice = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return toast.custom(
        (t) => (
            <div
                className={`${t.visible ? 'animate-slide-up' : 'animate-slide-down'} 
                max-w-sm w-full bg-linear-to-br from-indigo-800 to-purple-900
                shadow-2xl rounded-2xl pointer-events-auto 
                border border-indigo-400/20 ring-1 ring-white/10
                transition-all duration-500 transform`}
                style={{
                    boxShadow: '0 25px 60px rgba(79, 70, 229, 0.4), 0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                <div className="flex items-center gap-4 p-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm 
                        flex items-center justify-center shadow-lg shadow-indigo-500/30
                        border border-white/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 rounded-full animate-ping-slow bg-white/20"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white line-clamp-1">
                            {product.title}
                        </p>
                        <p className="text-xs text-indigo-200 font-medium mt-0.5 flex items-center gap-1.5">
                            ✓ به سبد خرید اضافه شد
                        </p>
                        <p className="text-[11px] text-indigo-300/80 mt-0.5">
                            {formatPrice(discountedPrice)} تومان
                        </p>
                    </div>

                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-indigo-300/60 hover:text-white transition-all duration-300 
                        hover:rotate-90 hover:scale-110 p-1 rounded-full hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-indigo-300 to-white rounded-b-2xl 
                        transition-all duration-[4000] ease-linear"
                        style={{
                            width: t.visible ? '0%' : '100%',
                            animation: 'shrink 5s linear forwards'
                        }}
                    ></div>
                </div>
            </div>
        ),
        {
            duration: 5000,
            position: 'bottom-left',
            style: {
                padding: '0',
                margin: '16px',
                maxWidth: '340px',
            },
        }
    );
};

// توست برای ثبت سفارش موفق
export const showOrderSuccessToast = () => {
    toast.custom(
        (t) => (
            <div
                className={`${t.visible ? 'animate-slide-up' : 'animate-slide-down'} 
                max-w-sm w-full bg-linear-to-br from-emerald-800 to-teal-900
                shadow-2xl rounded-2xl pointer-events-auto 
                border border-emerald-400/20 ring-1 ring-white/10
                transition-all duration-500 transform`}
                style={{
                    boxShadow: '0 25px 60px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                <div className="flex items-center gap-4 p-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm 
                        flex items-center justify-center shadow-lg shadow-emerald-500/30
                        border border-white/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 rounded-full animate-ping-slow bg-white/20"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">
                            🎉 سفارش شما ثبت شد!
                        </p>
                        <p className="text-xs text-emerald-200 font-medium mt-0.5 flex items-center gap-1.5">
                            ✓ سفارش با موفقیت انجام شد
                        </p>
                        <p className="text-[11px] text-emerald-300/80 mt-0.5">
                            منتظر تماس ما باشید
                        </p>
                    </div>

                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-emerald-300/60 hover:text-white transition-all duration-300 
                        hover:rotate-90 hover:scale-110 p-1 rounded-full hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-emerald-300 to-white rounded-b-2xl 
                        transition-all duration-[4000ms] ease-linear"
                        style={{
                            width: '100%',
                            animation: 'shrink 8s linear forwards'
                        }}
                    ></div>
                </div>
            </div>
        ),
        {
            duration: 8000,
            position: 'bottom-center',
            style: {
                padding: '0',
                margin: '16px',
                maxWidth: '340px',
                background: 'transparent',
                boxShadow: 'none',
            },
        }
    );
};


// توست برای خطا
export const showErrorToast = (message) => {
    toast.custom(
        (t) => (
            <div
                className={`${t.visible ? 'animate-slide-up' : 'animate-slide-down'} 
                max-w-sm w-full bg-linear-to-br from-red-800 to-rose-900
                shadow-2xl rounded-2xl pointer-events-auto 
                border border-red-400/20 ring-1 ring-white/10
                transition-all duration-500 transform`}
                style={{
                    boxShadow: '0 25px 60px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                <div className="flex items-center gap-4 p-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm 
                        flex items-center justify-center shadow-lg shadow-red-500/30
                        border border-white/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 rounded-full animate-ping-slow bg-white/20"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">
                            ⚠️ خطا!
                        </p>
                        <p className="text-xs text-rose-200 font-medium mt-0.5 flex items-center gap-1.5">
                            {message || 'مشکلی پیش آمده است'}
                        </p>
                    </div>

                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="text-rose-300/60 hover:text-white transition-all duration-300 
                        hover:rotate-90 hover:scale-110 p-1 rounded-full hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-red-300 to-white rounded-b-2xl 
                        transition-all duration-[4000ms] ease-linear"
                        style={{
                            width: '100%',
                            animation: 'shrink 8s linear forwards'
                        }}
                    ></div>
                </div>
            </div>
        ),
        {
            duration: 8000,
            position: 'bottom-center',
            style: {
                padding: '0',
                margin: '16px',
                maxWidth: '340px',
                background: 'transparent',
                boxShadow: 'none',
            },
        }
    );
};