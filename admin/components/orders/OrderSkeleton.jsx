// اسکلت در حال بارگذاری
export default function OrderSkeleton() {
    return (
        <div className="divide-y divide-gray-100/70">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4 sm:px-5">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
                        <div className="h-2.5 w-24 rounded bg-gray-200 animate-pulse" />
                    </div>
                    <div className="hidden sm:block h-3 w-20 rounded bg-gray-200 animate-pulse" />
                    <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                    <div className="hidden md:block h-3 w-16 rounded bg-gray-200 animate-pulse" />
                </div>
            ))}
        </div>
    );
}