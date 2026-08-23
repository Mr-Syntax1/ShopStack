// =============================================================
// صفحه وضعیت پرداخت: /payment/[orderId]
// -------------------------------------------------------------
// این صفحه مرجع بررسی وضعیت پرداخت است. چون بلوپال پارامتر
// بازگشت (return URL) ندارد، پس از پرداخت کاربر می‌تواند به
// این صفحه بازگردد یا آن را از ایمیل/پیامک دریافت کند.
// =============================================================
import PaymentStatusClient from './PaymentStatusClient';

export default async function PaymentStatusPage({ params }) {
    const { orderId } = await params; // در نسخه جدید Next، params یک Promise است

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50/30 via-white to-indigo-50/30 py-12 lg:py-16">
            <div className="container mx-auto max-w-xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-16">
                <PaymentStatusClient orderId={orderId} />
            </div>
        </div>
    );
}
