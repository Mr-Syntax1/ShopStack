// scripts/create-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        // اتصال به دیتابیس
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ متصل به دیتابیس');

        // ==============================
        // هش کردن رمز عبور
        // ==============================
        const PLAIN_PASSWORD = 'Borhangame1345';  // ← متغیر برای جلوگیری از اشتباه
        const hashedPassword = await bcrypt.hash(PLAIN_PASSWORD, 10);

        // ==============================
        // ایجاد کاربر ادمین
        // ==============================
        const adminUser = {
            name: 'مدیر سیستم',
            email: 'mrsyntax22@gmail.com',
            password: hashedPassword,
            phone: '09301486551',
            role: 'admin',
            emailVerified: true,
            createdAt: new Date(),
        };

        // ==============================
        // تعریف مدل User
        // ==============================
        const User = mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            phone: String,
            role: String,
            emailVerified: Boolean,
            createdAt: Date,
        }));

        // بررسی اینکه کاربر قبلاً وجود ندارد
        const existingUser = await User.findOne({ email: adminUser.email });
        if (existingUser) {
            console.log('⚠️ کاربر با این ایمیل قبلاً وجود دارد');
            console.log('📧 ایمیل:', existingUser.email);
            console.log('👤 نقش:', existingUser.role);
            process.exit(0);
        }

        // ایجاد کاربر
        await User.create(adminUser);
        console.log('✅ ادمین با موفقیت ایجاد شد');
        console.log('📧 ایمیل:', adminUser.email);
        console.log('🔑 رمز عبور:', PLAIN_PASSWORD);  // ✅ اصلاح شد
        console.log('📱 تلفن:', adminUser.phone);
        console.log('👤 نقش:', adminUser.role);

    } catch (error) {
        console.error('❌ خطا:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 قطع ارتباط با دیتابیس');
        process.exit(0);
    }
}

createAdmin();