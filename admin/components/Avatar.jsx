import Link from "next/link";

const AVATAR_GRADIENTS = [
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-fuchsia-600',
];

function getAvatarGradient(name) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function getInitials(name) {
    if (!name) return '?';
    // فقط حرف اول اسم
    return name.trim().charAt(0).toUpperCase();
}

export default function Avatar({
    name,           // اسم کاربر
    href = '#', // لینک
    size = 'md',    // سایز: 'sm', 'md', 'lg'
    onClick,        // رویداد کلیک
    className = '', // کلاس‌های اضافی
}) {
    const gradientClass = getAvatarGradient(name);
    const initials = getInitials(name);

    // سایزهای مختلف
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-lg',
    };

    const sizeClass = sizes[size] || sizes.md;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                relative rounded-full flex items-center justify-center font-bold text-white 
                transition-all duration-300 hover:scale-110 shadow-md 
                bg-linear-to-br ${gradientClass}
                ${sizeClass} ${className}
            `}
        >
            <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300" />
            {initials}
        </Link>
    );
}



export function AvatarWithOutLink({
    name,           // اسم کاربر
    size = 'md',    // سایز: 'sm', 'md', 'lg'
    onClick,        // رویداد کلیک
    className = '', // کلاس‌های اضافی
}) {
    const gradientClass = getAvatarGradient(name);
    const initials = getInitials(name);

    // سایزهای مختلف
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-lg',
    };

    const sizeClass = sizes[size] || sizes.md;

    return (
        <div
            onClick={onClick}
            className={`
                relative rounded-full flex items-center justify-center font-bold text-white 
                 shadow-md 
                bg-linear-to-br ${gradientClass}
                ${sizeClass} ${className}
            `}
        >
            <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300" />
            {initials}
        </div>
    );
}