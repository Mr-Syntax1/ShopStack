export default function StockBadge({ stock }) {
    if (stock === 0) {
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 cursor-pointer">ناموجود</span>;
    }
    if (stock < 5) {
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 cursor-pointer">موجودی محدود</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 cursor-pointer">موجود</span>;
}