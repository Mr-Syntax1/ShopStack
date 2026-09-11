import ProductBox from '../ProductBox';

export default function ProductsGrid({ products }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-16">
            {products.map((product, index) => (
                <div
                    key={product._id || product.id}
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay={(index % 4) * 100}
                    data-aos-once="true"
                    className="will-change-transform"
                >
                    <ProductBox
                        product={product}
                        priority={index < 4}
                    />
                </div>
            ))}
        </div>
    );
}