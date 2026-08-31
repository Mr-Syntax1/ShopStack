// lib/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};








// // lib/auth.js
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
// const JWT_EXPIRES_IN = '7d';

// // ==============================
// // هش کردن رمز عبور
// // ==============================
// export async function hashPassword(password) {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
// }

// // ==============================
// // مقایسه رمز عبور با هش
// // ==============================
// export async function comparePassword(password, hashedPassword) {
//     return await bcrypt.compare(password, hashedPassword);
// }

// // ==============================
// // ساخت JWT Token
// // ==============================
// export function generateToken(userId, email, role) {
//     return jwt.sign(
//         { userId, email, role },
//         JWT_SECRET,
//         { expiresIn: JWT_EXPIRES_IN }
//     );
// }

// // ==============================
// // تایید JWT Token
// // ==============================
// export function verifyToken(token) {
//     try {
//         return jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//         return null;
//     }
// }

// // ==============================
// // گرفتن کاربر از Token
// // ==============================
// export function getUserFromToken(token) {
//     const decoded = verifyToken(token);
//     if (!decoded) return null;
//     return decoded;
// }