import jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YThlZTllNzVlNGFiNzdiOTY0Nzc4ZWMiLCJlbWFpbCI6Im1hYW05ODYxN0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc4NzEzODU4MCwiZXhwIjoxNzg3NzQzMzgwfQ.JocC-XP1KVWqW9czBA4hjm2kZ5bnG0ov-r8A1DDmtTM';

const JWT_SECRET = '8f7h3k9d2j5n6q8w1e4r7t9y2u5i7o0p3l6k9j2h5f8s1d4g7j3k6n9q2w5e8r7t9y2u5i7o0p3l6k';

try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ توکن معتبر است!');
    console.log('اطلاعات:', decoded);
} catch (error) {
    console.log('❌ توکن نامعتبر است!');
    console.log('خطا:', error.message);
}