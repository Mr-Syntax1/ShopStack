export const categoriesData = [
    {
        id: "الکترونیک",
        name: "الکترونیک",
        subtitle: "جدیدترین تکنولوژی‌ها",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 17v4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 7h12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 11h8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="7" r="1.5" fill="currentColor" />
            </svg>
        ),
        linear: "from-blue-600 to-indigo-600",
        bgPattern: "bg-[radial-linear(ellipse_at_top_right,_var(--tw-linear-stops))] from-blue-400/20 via-transparent to-transparent",
    },
    {
        id: "گیمینگ",
        name: "گیمینگ",
        subtitle: "بهترین تجربه بازی",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M6 11h4M8 9v4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="10" r="0.5" fill="currentColor" stroke="none" />
                <circle cx="19" cy="10" r="0.5" fill="currentColor" stroke="none" />
                <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14v-2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8v.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        linear: "from-purple-600 to-pink-600",
        bgPattern: "bg-[radial-linear(ellipse_at_bottom_left,_var(--tw-linear-stops))] from-purple-400/20 via-transparent to-transparent",
    },
    {
        id: "موبایل",
        name: "موبایل",
        subtitle: "پرچم‌داران بازار",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} />
                <path d="M9 6h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
            </svg>
        ),
        linear: "from-emerald-500 to-teal-600",
        bgPattern: "bg-[radial-linear(ellipse_at_center,_var(--tw-linear-stops))] from-emerald-400/20 via-transparent to-transparent",
    },
    {
        id: "لوازم جانبی",
        name: "لوازم جانبی",
        subtitle: "تکمیل‌کننده‌های ضروری",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M4 7l2-3h12l2 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 7v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 11h8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 15h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="15" r="0.5" fill="currentColor" stroke="none" />
            </svg>
        ),
        linear: "from-amber-500 to-orange-600",
        bgPattern: "bg-[radial-linear(ellipse_at_top_left,_var(--tw-linear-stops))] from-amber-400/20 via-transparent to-transparent",
    },
    {
        id: "پوشیدنی",
        name: "پوشیدنی",
        subtitle: "سلامت و فناوری در مچ",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <rect x="7" y="4" width="10" height="16" rx="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 17h6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12h4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <path d="M7 9l-2 3 2 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 9l2 3-2 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        linear: "from-rose-500 to-pink-600",
        bgPattern: "bg-[radial-linear(ellipse_at_bottom_right,_var(--tw-linear-stops))] from-rose-400/20 via-transparent to-transparent",
    },
    {
        id: "بازی",
        name: "بازی",
        subtitle: "سرگرمی بی‌نهایت",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M12 2v4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 18v4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 12H2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 12h-2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.07 4.93l-2.83 2.83" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.76 16.24l-2.83 2.83" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.24 16.24l2.83 2.83" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.93 4.93l2.83 2.83" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
        linear: "from-cyan-500 to-blue-600",
        bgPattern: "bg-[radial-linear(ellipse_at_center,_var(--tw-linear-stops))] from-cyan-400/20 via-transparent to-transparent",
    },
    {
        id: "قطعات کامپیوتر",
        name: "قطعات کامپیوتر",
        subtitle: "سخت‌افزار حرفه‌ای",
        svg: (
            <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 19v2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 19v2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 9h4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 13h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="12" r="0.5" fill="currentColor" stroke="none" />
                <circle cx="17" cy="9" r="0.5" fill="currentColor" stroke="none" />
            </svg>
        ),
        linear: "from-red-500 to-rose-600",
        bgPattern: "bg-[radial-linear(ellipse_at_top_right,_var(--tw-linear-stops))] from-red-400/20 via-transparent to-transparent",
    },
];