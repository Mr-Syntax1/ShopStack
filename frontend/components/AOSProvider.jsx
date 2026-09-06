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
    }, []);

    useEffect(() => {
        AOS.refreshHard();
    }, [pathname]);

    return null; // چون فقط تنظیمات رو انجام میده
}
