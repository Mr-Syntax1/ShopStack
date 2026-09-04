const API_URL = process.env.NEXT_PUBLIC_API_URL;
let cache = null;
let cacheTime = 0;
let cacheKey = '';
let pendingPromise = null;
const CACHE_TTL = 30 * 1000;

export async function getDashboardData(range = '7days', forceRefresh = false) {
    const now = Date.now();
    const key = `${range}`;

    if (!forceRefresh && cache && cacheKey === key && now - cacheTime < CACHE_TTL) {
        return cache;
    }

    if (pendingPromise) {
        return pendingPromise;
    }

    pendingPromise = fetch(`${API_URL}/api/dashboard?range=${range}`, {
        cache: 'no-store',
        credentials: 'include',
    })
        .then(res => {
            if (!res.ok) throw new Error('خطا در دریافت داده‌های داشبورد');
            return res.json();
        })
        .then(data => {
            //  ذخیره در کش با کلید range
            cache = data;
            cacheTime = now;
            cacheKey = key;
            return data;
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            throw error;
        })
        .finally(() => {
            pendingPromise = null;
        });

    return pendingPromise;
}