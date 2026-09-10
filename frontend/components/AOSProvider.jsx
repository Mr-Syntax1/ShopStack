'use client'

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider() {
    const pathname = usePathname();

    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            // 	هر بار که اسکرول کنی، انیمیشن دوباره اجرا نمیشه
            offset: 60,
            delay: 0,
            anchorPlacement: "top-bottom",
        });

        // صفحاتی که محتواشون async رندر میشه، بعد از init المنت data-aos به DOM اضافه می‌کنن.
        // توجه: refresh() فقط المنت‌های کش‌شده قبلی رو پردازش می‌کنه؛
        // فقط refreshHard() دوباره DOM رو اسکن می‌کنه و aos-animate میده
        let timeoutId;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => AOS.refreshHard(), 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        AOS.refreshHard();
    }, [pathname]);

    return null; // چون فقط تنظیمات رو انجام میده
}
