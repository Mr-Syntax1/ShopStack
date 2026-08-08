import * as yup from 'yup';

// اعتبارسنجی فرم سبد خرید
export const orderSchema = yup.object({
    name: yup
        .string()
        .required('نام و نام خانوادگی الزامی است')
        .min(3, 'نام باید حداقل 3 کاراکتر باشد')
        .max(50, 'نام حداکثر 50 کاراکتر باشد')
        .trim(),

    email: yup
        .string()
        .required('ایمیل الزامی است')
        .email('ایمیل معتبر نیست')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'ایمیل معتبر نیست')
        .trim()
        .lowercase(),

    phone: yup
        .string()
        .required('شماره تماس الزامی است')
        .matches(/^09[0-9]{9}$/, 'شماره تماس باید با 09 شروع شود و 11 رقم باشد')
        .trim(),

    city: yup
        .string()
        .required('شهر الزامی است')
        .min(2, 'شهر باید حداقل 2 کاراکتر باشد')
        .max(30, 'شهر حداکثر 30 کاراکتر باشد')
        .trim(),

    postalCode: yup
        .string()
        .required('کد پستی الزامی است')
        .matches(/^[0-9]{10}$/, 'کد پستی باید 10 رقم باشد')
        .trim(),

    address: yup
        .string()
        .required('آدرس کامل الزامی است')
        .min(10, 'آدرس باید حداقل 10 کاراکتر باشد')
        .max(200, 'آدرس حداکثر 200 کاراکتر باشد')
        .trim(),

    country: yup
        .string()
        .required('کشور الزامی است')
        .default('ایران'),
});

export default orderSchema;