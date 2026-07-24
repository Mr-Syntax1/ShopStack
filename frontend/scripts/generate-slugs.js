import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from 'dotenv'

dotenv.config();

const uri = process.env.MONGODB_URI;

// تابع تولید slug از title
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, '')
        .replace(/-+/g, '-');
}

async function generateSlugs() {
    try {
        await mongoose.connect(uri, { dbName: 'test' })
        console.log('you connect to db');

        const products = await Product.find({})

        if (products.lenght === 0) {
            console.log('there is no product in db ❌');
            process.exit(0)
        }

        console.log(`${products.lenght} pruducts find...`);

        // برای هر محصول، slug بساز و ذخیره کن
        for (const product of products) {
            const slug = generateSlug(product.title);
            product.slug = slug
            await product.save()
            console.log(`${product.title} -> ${slug}`);
        }

        console.log('All slug add successfully');
        process.exit(0)

    } catch (error) {
        console.error('error: ', error)
        process.exit(1)
    }
}

generateSlugs()