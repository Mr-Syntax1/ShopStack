import mongoose from "mongoose";

const uri = process.env.MONGODB_URI

if (!uri) throw new Error('تنظیمات دیتابیس را وارد کنید')

let isConnected = false // برای بهینگی و سرعت
//اگه قبلاً وصل شده بود، دوباره وصل نمیشه (بهینه‌سازی)


export async function connectedToDatabase() {
    if (isConnected) {
        console.log('قبلا متصل شده اید')
        return
    }

    try {
        await mongoose.connect(uri, { dbName: 'test' })
        isConnected = true
        console.log('اتصال موفق به دیتابیس');

    } catch (error) {
        console.error(error)
        throw error
    }

}