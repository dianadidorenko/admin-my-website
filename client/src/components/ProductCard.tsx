interface Volume {
  volume: string;
  price: string;
  weight: string;
}

interface Product {
  _id: string;
  productName: string;
  brand: string;
  hit: boolean;
  images: string[];
  volumes: Volume[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div
      key={product._id}
      className="flex flex-col items-center justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative duration-300 overflow-hidden rounded-lg">
        <img
          src={product.images[0] || "https://placehold.co/600x400/EEE/31343C"}
          alt={product.productName}
          className="w-48 h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
        />
      </div>

      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-gray-800">
          {product.productName}
        </p>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <p className="text-sm text-gray-700 font-medium mt-2">
          {product.volumes[0].price} грн.
        </p>
      </div>

      <div className="mt-4 flex gap-4">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-600 transition-colors duration-300">
          Подробней
        </button>
        <button className="px-4 py-2 border border-gray-300 bg-[#fb5e98] hover:bg-[#f0377b] text-white rounded-lg transition-colors duration-300">
          Купить
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
