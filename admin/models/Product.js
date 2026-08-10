import mongoose from "mongoose";

// تابع تولید slug از title
function generateSlug(title) {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')              // فاصله به -
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, '') // فقط حروف فارسی، انگلیسی، اعداد و -
        .replace(/-+/g, '-')                // چند - متوالی به یکی تبدیل کن
        .replace(/^-|-$/g, '');             // - اول و آخر رو حذف کن
}

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        sparse: true // اجازه میده مقدار null یا undefined باشه برای محصولات قدیمی
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    brand: {
        type: String,
        required: true, // حتما باید باشه
        trim: true // فاصله ها رو پاک کن
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true // اضافه کردن createdAt و updatedAt به صورت خودکار
});

// ============================================================
// === FIX: در Mongoose 6+ (اینجا نسخه 9.x) پارامتر next() از
// === میدلورها حذف شده و دیگر پاس داده نمی‌شود. فراخوانی next()
// === باعث خطای "next is not a function" می‌شد و ذخیره‌سازی
// === (POST محصول) با 500 شکست می‌خورد.
// === راه حل: حذف پارامتر next و فراخوانی next() و استفاده از
// === async/await برای مدیریت خطاها.
// ============================================================
// میدلور قبل از ذخیره: slug رو خودکار بساز
ProductSchema.pre('save', async function () {
    // اگر slug وجود نداره یا title تغییر کرده، slug رو بساز
    if (!this.slug || this.isModified('title')) {
        let baseSlug = generateSlug(this.title);

        // اگر اسلاگ تکراری بود، عدد بهش اضافه کن
        const Product = this.constructor;
        let slug = baseSlug;
        let counter = 1;

        // اگه slug خالی نباشه و تکراری باشه
        while (slug && await Product.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
});

// ============================================================
// === FIX: همان مشکل next() در میدلور آپدیت (برای جلوگیری از
// === خطای مشابه هنگام ویرایش محصول).
// ============================================================
// میدلور قبل از آپدیت: اگر title تغییر کرده، slug رو به‌روز کن
ProductSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();
    if (update.title) {
        const Product = this.model;
        const doc = await Product.findOne(this.getQuery());
        if (doc && doc.title !== update.title) {
            let baseSlug = generateSlug(update.title);
            let slug = baseSlug;
            let counter = 1;

            while (await Product.findOne({ slug, _id: { $ne: doc._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            this.set({ slug });
        }
    }
});

// ============================================================
// === در حالت توسعه مدل کش‌شده رو پاک می‌کنیم تا تغییرات schema
// === (مثل اصلاح میدلورها) بدون ری‌استارت سرور اعمال بشه.
// ============================================================
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

//یه مدل (Model) که به ما اجازه میده با محصولات توی دیتابیس کار کنیم
//مثل یک پل بین کد ما و دیتابیس