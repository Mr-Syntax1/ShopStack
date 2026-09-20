// // NEW VERSION
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('❌ لطفا MONGODB_URI را در فایل .env.local تعریف کنید');
}

// کش کردن اتصال در global (برای محیط Serverless)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectedToDatabase() {
    // اگر قبلاً متصل شده‌ایم، همان اتصال را برگردان
    if (cached.conn) {
        console.log('🔄️ استفاده از اتصال موجود');
        return cached.conn;
    }

    // اگر در حال اتصال هستیم، منتظر بمان
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,        // اگر دیتابیس در دسترس نباشه، درخواست‌ها رو بافر نکن
            maxPoolSize: 5,               // تعداد اتصالات همزمان (کمتر = فشار کمتر روی اتصال)
            minPoolSize: 1,               // حداقل یک اتصال همیشه باز بمونه (برای سرعت)
            serverSelectionTimeoutMS: 15000, // ۱۵ ثانیه برای پیدا کردن سرور (بهتر از ۸ ثانیه)
            maxIdleTimeMS: 30000,  // اتصالات بی‌کار رو ببند
            socketTimeoutMS: 60000,       // ۶۰ ثانیه برای هر درخواست (بهتر از ۴۵ ثانیه)
            connectTimeoutMS: 15000,      // ۱۵ ثانیه برای برقراری اتصال اولیه
            heartbeatFrequencyMS: 10000,  // هر ۱۰ ثانیه وضعیت اتصال رو چک کن
            retryWrites: true,            // اگر نوشتن ناموفق بود، دوباره تلاش کن
            family: 4,                    // استفاده از IPv4
        };

        console.log('🟡 برقراری اتصال جدید به MongoDB...');
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('✅ اتصال به MongoDB برقرار شد');
                return mongoose;
            })
            .catch((error) => {
                console.error('❌ خطا در اتصال به MongoDB:', error);
                cached.promise = null; // ریست کردن برای تلاش مجدد
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        // سعی می‌کنیم منتظر بمانیم تا اتصال کامل بشه
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

// -------------------------------------------

// OLD VERSION
// import mongoose from "mongoose";

// const uri = process.env.MONGODB_URI

// if (!uri) throw new Error('تنظیمات دیتابیس را وارد کنید')

// let isConnected = false // برای بهینگی و سرعت
// //اگه قبلاً وصل شده بود، دوباره وصل نمیشه (بهینه‌سازی)


// export async function connectedToDatabase() {
//     if (isConnected) {
//         console.log('قبلا متصل شده اید')
//         return
//     }

//     try {
//         await mongoose.connect(uri, { dbName: 'test' })
//         isConnected = true
//         console.log('اتصال موفق به دیتابیس');

//     } catch (error) {
//         console.error(error)
//         throw error
//     }
// }

