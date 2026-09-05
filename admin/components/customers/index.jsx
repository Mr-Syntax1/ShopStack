'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toPersianDigits, formatPrice, formatDate, initials } from '@/lib/persian';
import CustomerSkeleton from './CustomerSkeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ROLE_CONFIG = {
    admin: {
        label: 'ادمین',
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        dot: 'bg-indigo-500',
    },
    user: {
        label: 'کاربر',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        dot: 'bg-gray-400',
    },
};

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

const StatCard = ({ icon, label, value, sub, colorClass }) => (
    <div className="rounded-2xl border border-gray-100/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[12.5px] font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-gray-800">{value}</p>
                {sub && <p className="mt-0.5 text-[11.5px] text-gray-400">{sub}</p>}
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default function CustomersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [changingRoleId, setChangingRoleId] = useState(null);

    const pageSize = 10;

    const fetchUsers = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users`, { cache: 'no-store' });
            if (!res.ok) throw new Error(res.status === 500 ? 'خطای سرور (۵۰۰)' : `خطا: ${res.status}`);
            const data = await res.json();
            setUsers(Array.isArray(data.users) ? data.users : []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message || 'خطا در دریافت کاربران');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const updateUserRole = useCallback(async (userId, newRole) => {
        setChangingRoleId(userId);
        try {
            const res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'خطا در تغییر نقش');
            }
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error('Error updating role:', err);
            alert(err.message || 'خطا در تغییر نقش کاربر');
        } finally {
            setChangingRoleId(null);
        }
    }, []);

    const deleteUser = useCallback(async (userId) => {
        if (!confirm('آیا از حذف این کاربر اطمینان دارید؟ این عمل قابل بازگشت نیست.')) return;

        try {
            const res = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'خطا در حذف کاربر');
            }
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.error('Error deleting user:', err);
            alert(err.message || 'خطا در حذف کاربر');
        }
    }, []);

    const stats = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role === 'admin').length;
        const regularUsers = total - admins;
        const totalBalance = users.reduce((s, u) => s + (u.balance || 0), 0);
        return { total, admins, regularUsers, totalBalance };
    }, [users]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter(u => {
            const matchRole = roleFilter === 'all' || u.role === roleFilter;
            const matchSearch =
                !q ||
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.phone?.includes(q);
            return matchRole && matchSearch;
        });
    }, [users, roleFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    return (
        <div className="p-4 md:p-6 lg:p-8 mt-6 lg:mt-0">
            {/* هدر */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-800">مشتریان</h1>
                            <p className="mt-0.5 text-[12.5px] text-gray-500">مدیریت کاربران و مشاهده اطلاعات</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={fetchUsers}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200/80 transition-colors hover:bg-gray-100 cursor-pointer"
                >
                    <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    به‌روزرسانی
                </button>
            </div>

            {/* آمار */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 mb-6">
                <StatCard
                    label="کل کاربران"
                    value={toPersianDigits(stats.total)}
                    sub={`${toPersianDigits(stats.admins)} ادمین`}
                    colorClass="bg-indigo-50 text-indigo-600"
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                />
                <StatCard
                    label="ادمین‌ها"
                    value={toPersianDigits(stats.admins)}
                    colorClass="bg-emerald-50 text-emerald-600"
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    }
                />
                <StatCard
                    label="کاربران عادی"
                    value={toPersianDigits(stats.regularUsers)}
                    colorClass="bg-amber-50 text-amber-600"
                    icon={
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                />
            </div>

            {/* خطا */}
            {error && (
                <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">خطا در دریافت کاربران</p>
                    <p className="mt-1 text-[13px] text-gray-500">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                        تلاش مجدد
                    </button>
                </div>
            )}

            {/* جدول */}
            {!error && (
                <div className="rounded-2xl border border-gray-100/80 bg-white/80 shadow-sm backdrop-blur-sm">
                    {/* فیلترها */}
                    <div className="flex flex-col gap-3 border-b border-gray-100/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="جستجوی نام، ایمیل یا شماره..."
                                className="w-full rounded-xl border border-gray-200/80 bg-white py-2.5 pr-9 pl-3 text-[13px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {['all', 'admin', 'user'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => {
                                        setRoleFilter(role);
                                        setPage(1);
                                    }}
                                    className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${roleFilter === role ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {role === 'all' ? 'همه' : role === 'admin' ? 'ادمین‌ها' : 'کاربران'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* اسکلت / خالی */}
                    {loading && <CustomerSkeleton />}

                    {!loading && pageItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-600">کاربری یافت نشد</p>
                            <p className="text-[12.5px] text-gray-400">فیلترها را تغییر دهید یا صفحه را به‌روزرسانی کنید.</p>
                        </div>
                    )}

                    {/* جدول */}
                    {!loading && pageItems.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] border-collapse text-right">
                                <thead>
                                    <tr className="border-b border-gray-100/70 text-right">
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 sm:px-5">کاربر</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 hidden sm:table-cell">ایمیل</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 hidden md:table-cell">شماره</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400">نقش</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400 hidden lg:table-cell">تاریخ عضویت</th>
                                        <th className="px-4 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-gray-400"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {pageItems.map((user) => {
                                        const roleConf = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                                        const avatarGradient = getAvatarGradient(user.name);
                                        const userInitials = initials(user.name);
                                        const isChanging = changingRoleId === user._id;

                                        return (
                                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                                {/* کاربر */}
                                                <td className="px-4 py-3 sm:px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient} text-sm font-bold text-white shadow-sm`}>
                                                            {userInitials}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
                                                            <p className="text-[11.5px] text-gray-400 sm:hidden">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ایمیل */}
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <span className="text-sm text-gray-600">{user.email}</span>
                                                </td>

                                                {/* شماره */}
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className="text-sm text-gray-600">{user.phone}</span>
                                                </td>

                                                {/* نقش */}
                                                <td className="px-4 py-3">
                                                    <div className="relative">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                            disabled={isChanging}
                                                            className={`appearance-none rounded-full px-3 py-1.5 text-[12.5px] font-semibold cursor-pointer outline-none transition-colors ${roleConf.bg} ${roleConf.text} ${isChanging ? 'opacity-70 cursor-wait' : 'hover:opacity-80'}`}
                                                        >
                                                            <option value="user">کاربر</option>
                                                            <option value="admin">ادمین</option>
                                                        </select>
                                                    </div>
                                                </td>


                                                {/* تاریخ */}
                                                <td className="px-4 py-3 hidden lg:table-cell">
                                                    <span className="text-[13px] text-gray-600">
                                                        {formatDate(user.createdAt)}
                                                    </span>
                                                </td>

                                                {/* عملیات */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                            title="حذف کاربر"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* صفحه‌بندی */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between gap-3 border-t border-gray-100/70 px-4 py-3 sm:px-5">
                            <p className="text-[12.5px] text-gray-500">
                                نمایش {toPersianDigits((safePage - 1) * pageSize + 1)} تا {toPersianDigits(Math.min(safePage * pageSize, filtered.length))} از {toPersianDigits(filtered.length)}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 ring-1 ring-gray-200/80 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-semibold transition-colors ${safePage === i + 1 ? 'bg-indigo-600 text-white' : 'text-gray-600 ring-1 ring-gray-200/80 hover:bg-gray-50'}`}
                                    >
                                        {toPersianDigits(i + 1)}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safePage === totalPages}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 ring-1 ring-gray-200/80 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
