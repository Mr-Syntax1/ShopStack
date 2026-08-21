// cleanupid.js
// ساخته شده با هوش مصنوعی

const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ متغیر محیطی MONGODB_URI در فایل .env.local پیدا نشد.');
    console.error('📁 مسیر جستجو:', require('path').join(__dirname, '../.env.local'));
    process.exit(1);
}

console.log('✅ متغیر MONGODB_URI پیدا شد!');

async function cleanupDatabase() {
    console.log('🟡 در حال اتصال به MongoDB Atlas...');
    console.log(`📡 رشته اتصال: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // مخفی کردن رمز

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ اتصال با موفقیت برقرار شد.');

        const db = mongoose.connection.db;
        const collection = db.collection('products');

        // ==============================
        // نمایش لیست ایندکس‌های فعلی
        // ==============================
        console.log('📋 لیست ایندکس‌های فعلی:');
        const indexes = await collection.getIndexes();
        console.log(indexes);

        // ==============================
        // مرحله 1: حذف ایندکس اضافی
        // ==============================
        try {
            await collection.dropIndex('id_1');
            console.log('✅ ایندکس id_1 با موفقیت حذف شد.');
        } catch (error) {
            if (error.code === 27) {
                console.log('⚠️ ایندکس id_1 از قبل وجود نداشت.');
            } else {
                console.error('❌ خطا در حذف ایندکس:', error);
            }
        }

        // ==============================
        // مرحله 2: حذف فیلد id از تمام اسناد
        // ==============================
        try {
            // اول تعداد اسناد رو چک کنیم
            const count = await collection.countDocuments({ id: { $exists: true } });
            console.log(`📊 ${count} سند دارای فیلد id هستند.`);

            if (count > 0) {
                const result = await collection.updateMany(
                    { id: { $exists: true } }, // فقط اسنادی که فیلد id دارند
                    { $unset: { id: "" } }
                );
                console.log(`✅ فیلد id از ${result.modifiedCount} سند با موفقیت حذف شد.`);
            } else {
                console.log('ℹ️ هیچ سندی فیلد id ندارد.');
            }
        } catch (error) {
            console.error('❌ خطا در حذف فیلد id از اسناد:', error);
        }

        // ==============================
        // نمایش لیست ایندکس‌ها بعد از پاکسازی
        // ==============================
        console.log('📋 لیست ایندکس‌ها بعد از پاکسازی:');
        const newIndexes = await collection.getIndexes();
        console.log(newIndexes);

        console.log('🏁 عملیات پاکسازی با موفقیت به پایان رسید.');
        await mongoose.disconnect();
        console.log('🔴 اتصال قطع شد.');

    } catch (error) {
        console.error('❌ خطا در اتصال به دیتابیس:', error);
        process.exit(1);
    }
}

cleanupDatabase();