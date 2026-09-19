// lib/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

//  چک کردن وجود JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET تنظیم نشده است! لطفاً در .env.local مقداردهی کنید.');
}

// ==============================
// هش کردن رمز عبور
// ==============================
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// ==============================
// مقایسه رمز عبور با هش
// ==============================
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// ==============================
// ساخت JWT Token
// ==============================
export const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// ==============================
// تایید JWT Token
// ==============================
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// ==============================
// گرفتن کاربر از Token
// ==============================
export const getUserFromToken = (token) => {
    const decoded = verifyToken(token);
    if (!decoded) return null;
    return decoded;
};