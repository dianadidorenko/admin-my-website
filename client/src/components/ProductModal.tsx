import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { X } from "lucide-react";
import { Product, Volume } from "@/lib/types";

interface ProductModalProps {
  productId: string;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ productId, onClose }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${config.baseUrl}/products/${productId}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const volumeIndex = parseInt(e.target.value);
    setSelectedVolume(product?.volumes[volumeIndex] || null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-[90%] max-w-[700px] h-[600px] relative transition-transform transform scale-100 duration-300 overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>
        <div className="flex flex-col items-center">
          <img
            src={product?.images[0] || "https://placehold.co/600x400"}
            alt={product?.productName}
            className="w-[400px] h-[400px] object-cover rounded-lg"
          />
          <h2 className="text-2xl text-center font-bold my-4">
            {product?.productName}
          </h2>
          <p className="text-gray-500">{product?.brand}</p>
          <p className="text-medium mt-2 text-center">{product?.description}</p>

          {product?.volumes.length === 1 ? (
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-lg font-semibold">
                Цена: {selectedVolume?.price || product?.volumes[0]?.price} ₴
              </p>
              <p className="text-lg font-semibold">
                {selectedVolume?.volume || product?.volumes[0]?.volume} мл
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <p className="text-lg font-semibold my-6">
                Цена: {selectedVolume?.price || product?.volumes[0]?.price} ₴
              </p>
              <label htmlFor="volume" className="mb-2 font-medium">
                Выберите объем:
              </label>
              <select
                id="volume"
                className="w-[150px] p-2 border rounded-lg shadow-sm"
                onChange={handleVolumeChange}
              >
                {product?.volumes.map((item, index) => (
                  <option key={index} value={index}>
                    {item.volume} мл
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md">
              Купить
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg shadow-md"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
