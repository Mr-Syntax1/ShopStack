import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

    // اطلاعات کاربر
    user: {
        name: {
            type: String,
            required: [true, 'نام و نام خانوادگی الزامی است'],
            trim: true,
            minlength: [3, 'نام باید حداقل 3 کاراکتر باشد']
        },

        email: {
            type: String,
            required: [true, 'ایمیل الزامی است'],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'ایمیل معتبر نیست']
        },

        country: {
            type: String,
            required: [true, 'کشور الزامی است'],
            trim: true,
            default: 'ایران'
        },

        city: {
            type: String,
            required: [true, 'شهر الزامی است'],
            trim: true
        },

        address: {
            type: String,
            required: [true, 'آدرس کامل الزامی است'],
            trim: true,
            minlength: [10, 'آدرس باید حداقل 10 کاراکتر باشد']
        },

        postalCode: {
            type: String,
            required: [true, 'کد پستی الزامی است'],
            trim: true,
            match: [/^[0-9]{10}$/, 'کد پستی باید 10 رقم باشد']
        },

        phone: {
            type: String,
            required: [true, 'شماره تماس الزامی است'],
            trim: true,
            match: [/^09[0-9]{9}$/, 'شماره تماس باید با 09 شروع شود و 11 رقم باشد']
        },
    },

    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        image: {
            type: String,
            required: true,
            trim: true
        }
    }],

    totalPrice: Number,
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },

    // =============================================================
    // اطلاعات پرداخت بلوپال (برای نمایش در پنل ادمین و ردیابی)
    // وبهوک پرداخت این بخش را پر می‌کند.
    // =============================================================
    payment: {
        invoiceId: { type: Number, default: null },       // شناسه فاکتور بلوپال

        status: {                                          // وضعیت پرداخت: PENDING | PAID | EXPIRED | CANCELED
            type: String,
            enum: ['PENDING', 'PAID', 'EXPIRED', 'CANCELED'],
            default: null
        },

        mode: { type: String, enum: ['sandbox', 'live'], default: null }, // محیط فاکتور

        cardNumber: { type: String, default: null },       // شماره کارت مقصد (کارتی که باید به آن واریز شود)

        transactionId: { type: Number, default: null },    // شناسه تراکنش

        payerName: { type: String, default: null },        // نام پرداخت‌کننده

        payerCard: { type: String, default: null },        // شماره کارت پرداخت‌کننده / شبا 
        // (برای بلو‌بانک)
        payerBankName: { type: String, default: null },    // نام بانک مبدأ

        paidAt: { type: Date, default: null },             // زمان پرداخت موفق
    },

    createdAt: { type: Date, default: Date.now, index: true }

}, {
    timestamps: true // اضافه کردن createdAt و updatedAt
});

// مدل نهایی
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);