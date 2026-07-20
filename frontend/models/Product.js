import mongoose from "mongoose";

// const { default: mongoose } = require('mongoose')

const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true // مقدار این باید یکتا و منحصر به فرد باشه
    },
    title: {
        type: String,
        required: true,
        trim: true
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
    subCategory: {
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


export default mongoose.model.Product || mongoose.model('Product', ProductSchema)

//یه مدل (Model) که به ما اجازه میده با محصولات توی دیتابیس کار کنیم
//مثل یک پل بین کد ما و دیتابیس
