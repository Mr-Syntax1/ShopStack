import ProductBox from '../ProductBox';

export default function ProductsGrid({ products }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product, index) => (
                <ProductBox
                    key={product._id || product.id}
                    product={product}
                    priority={index < 4}
                />
            ))}
        </div>
    );
}