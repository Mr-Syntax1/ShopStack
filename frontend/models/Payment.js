//// مدل تراکنش پرداخت (Payment) - متصل به همان دیتابیس سفارشات

import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    // شناسه سفارش مرتبط در فروشگاه (یک به یک)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // برای جستجوی سریع
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId, // اشاره به _id 
        ref: 'Order', // populate
        required: true,
        index: true,
    },

    // شناسه فاکتور بلوپال (عدد) - یکتا
    invoiceId: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },

    // مبلغ درخواستی اصلی به ریال (قبل از عدد تصادفی)
    amount: {
        type: Number,
        required: true,
        min: 0,
    },

    // مبلغ نهایی که باید واریز شود = مبلغ اصلی + ۳ رقم تصادفی
    finalAmount: {
        type: Number,
        default: 0,
    },

    // وضعیت فاکتور: PENDING | PAID | EXPIRED | CANCELED
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'EXPIRED', 'CANCELED'],
        default: 'PENDING',
        index: true,
    },

    // محیط فاکتور: sandbox (آزمایشی) یا live (واقعی)
    mode: {
        type: String,
        enum: ['sandbox', 'live'],
        default: 'sandbox',
    },

    // لینک پرداخت بلوپال برای ریدایرکت کاربر
    paymentLink: {
        type: String,
        default: '',
    },

    // شماره کارت مقصد (در صورت برگشت از بلوپال)
    cardNumber: {
        type: String,
        default: '',
    },

    // شناسه تراکنش بلوپال پس از پرداخت موفق
    transactionId: {
        type: Number,
        default: null,
    },

    // اطلاعات پرداخت‌کننده (فقط پس از پرداخت موفق پر می‌شود)
    payer: {
        name: { type: String, default: null },
        card: { type: String, default: null },
        bankName: { type: String, default: null },
    },

    // زمان پرداخت موفق
    paidAt: {
        type: Date,
        default: null,
    },

    // زمان انقضای فاکتور (طبق پاسخ بلوپال)
    expiresAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true, // createdAt و updatedAt
});

// ایندکس برای جستجوی سریع فاکتورهای کاربر
PaymentSchema.index({ userId: 1, createdAt: -1 });

// جلوگیری از کامپایل چندباره مدل در محیط توسعه
export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);