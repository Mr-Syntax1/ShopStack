export default function ProductTableSkeleton() {
    return (
        <div className="overflow-x-auto animate-pulse">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </th>
                        <th className="p-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </th>
                        <th className="p-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </th>
                        <th className="p-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </th>
                        <th className="p-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                            <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}