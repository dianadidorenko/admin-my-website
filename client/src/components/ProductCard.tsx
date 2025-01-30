import { StoreContext } from "@/context/storeContext";
import axios from "axios";
import { Heart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { config } from "../../config";
import ProductModal from "./ProductModal";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { token, addToCart } = useContext(StoreContext)!;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${config?.baseUrl}/users/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const wishlist = response.data.wishlist;
        if (wishlist.some((item: Product) => item._id === product._id)) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Ошибка получения списка избранного:", error);
      }
    };

    fetchWishlist();
  }, [product._id, token]);

  const handleFavoriteClick = async () => {
    if (!token) {
      toast.error("Пожалуйста, авторизуйтесь, чтобы добавлять в избранное.");
      return;
    }

    try {
      if (isFavorite) {
        // Удаление из избранного
        await axios.delete(
          `${config?.baseUrl}/users/wishlist/remove/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Товар удален из избранного.");
      } else {
        // Добавление в избранное
        await axios.post(
          `${config?.baseUrl}/users/wishlist/add`,
          { productId: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Товар добавлен в избранное.");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Ошибка при изменении избранного:", error);
      toast.error("Что-то пошло не так. Попробуйте еще раз.");
    }
  };

  // Добавление товара в корзину
  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Пожалуйста, авторизуйтесь для добавления в корзину.");
      navigate("/register");
      return;
    }

    try {
      await addToCart(product, 1);
      toast.success("Товар добавлен в корзину.");
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      toast.error("Ошибка добавления в корзину.");
    }
  };

  return (
    <>
      <div
        key={product._id}
        className="relative flex flex-col items-center justify-between p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div className="duration-300 overflow-hidden rounded-lg">
          <img
            src={product.images[0] || "https://placehold.co/600x400/EEE/31343C"}
            alt={product.productName}
            className="w-48 h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
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

        <Heart
          size={23}
          fill={isFavorite ? "#fa5592" : "none"}
          color="#fa5592"
          className="absolute z-10 right-5 top-3 cursor-pointer"
          onClick={handleFavoriteClick}
        />

        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-600 transition-colors duration-300"
          >
            Подробней
          </button>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 border border-gray-300 bg-[#fb5e98] hover:bg-[#f0377b] text-white rounded-lg transition-colors duration-300"
          >
            Купить
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ProductModal
          productId={product._id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
