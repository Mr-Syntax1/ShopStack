// =============================================================
// مدل تراکنش پرداخت (نسخه پنل ادمین)
// -------------------------------------------------------------
// همان ساختار مدل فرانت‌اند؛ برای همگام‌سازی رکورد پرداخت هنگام
// بروزرسانی دستی وضعیت از بلوپال استفاده می‌شود.
// =============================================================
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },

    invoiceId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    finalAmount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'EXPIRED', 'CANCELED'], default: 'PENDING', index: true
    },

    mode: {
        type: String,
        enum: ['sandbox', 'live'], default: 'sandbox'
    },

    paymentLink: {
        type: String,
        default: ''
    },

    cardNumber: {
        type: String,
        default: ''
    },

    transactionId: {
        type: Number,
        default: null
    },

    payer: {
        name: {
            type: String,
            default: null
        },
        card: {
            type: String,
            default: null
        },
        bankName: {
            type: String,
            default: null
        },
    },

    paidAt: { type: Date, default: null },

    expiresAt: { type: Date, default: null },

}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
