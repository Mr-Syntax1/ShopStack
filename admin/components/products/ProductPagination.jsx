import Pagination from '../Pagination';

export default function ProductPagination({
    currentPage,
    totalPages,
    totalProducts,
    limit,
    onPageChange
}) {
    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProducts}
            itemsPerPage={limit}
            itemsLabel="محصول"
            onPageChange={onPageChange}
        />
    );
}
