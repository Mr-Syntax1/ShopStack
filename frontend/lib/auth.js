import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
//	هش کردن رمز عبور (برای ذخیره امن در دیتابیس)

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET در متغیرهای محیطی تعریف نشده است');
}

const JWT_EXPIRES_IN = '7d';

// ==============================
// هش کردن رمز عبور
// ==============================
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}

// ==============================
// مقایسه رمز عبور با هش
// ==============================
export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// ==============================
// ساخت JWT Token
// ==============================
export function generateToken(userId, email, role) {
    return jwt.sign(
        { userId, email, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// ==============================
// تایید JWT Token
// ==============================
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// ==============================
// گرفتن کاربر از Token
// ==============================
export function getUserFromToken(token) {
    const decoded = verifyToken(token);
    if (!decoded) return null;
    return decoded;
}

// ==============================
// ساخت Admin Token برای SSO (عمر کوتاه: ۵ دقیقه)
// ==============================
export function generateAdminToken(userId, email) {
    return jwt.sign(
        { userId, email, type: 'admin_sso' },
        JWT_SECRET,
        { expiresIn: '5m' }
    );
}

// ==============================
// تایید Admin Token برای SSO
// ==============================
export function verifyAdminToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'admin_sso') return null;
        return decoded;
    } catch (error) {
        return null;
    }
}