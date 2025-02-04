import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
import { Product, Volume } from "@/lib/types";
import Container from "@/components/Container";
import { Heart } from "lucide-react";
import { StoreContext } from "@/context/storeContext";
import toast from "react-hot-toast";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const volumeIndex = parseInt(e.target.value);
    setSelectedVolume(product?.volumes[volumeIndex] || null);
  };

  const { token, addToCart } = useContext(StoreContext)!;

  const navigate = useNavigate();

  // Функция загрузки данных о товаре
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${config.baseUrl}/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Получение списка избранного
  useEffect(() => {
    if (!product) return;

    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${config?.baseUrl}/users/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const wishlist = response.data.wishlist;
        setIsFavorite(
          wishlist.some((item: Product) => item._id === product._id)
        );
      } catch (error) {
        console.error("Ошибка получения списка избранного:", error);
      }
    };

    fetchWishlist();
  }, [product, token]);

  // Добавление товара в избранное
  const handleFavoriteClick = async () => {
    if (!token) {
      toast.error("Пожалуйста, авторизуйтесь, чтобы добавлять в избранное.");
      return;
    }
    if (!product) return;

    try {
      if (isFavorite) {
        await axios.delete(
          `${config?.baseUrl}/users/wishlist/remove/${product._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Товар удален из избранного.");
      } else {
        await axios.post(
          `${config?.baseUrl}/users/wishlist/add`,
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${token}` },
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
    if (!product) return;

    try {
      await addToCart(product, 1);
      toast.success("Товар добавлен в корзину.");
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      toast.error("Ошибка добавления в корзину.");
    }
  };

  if (!product)
    return <p className="text-center mt-10 text-gray-500">Товар не найден</p>;

  return (
    <Container>
      <div className="flex items-start justify-between px-20">
        <div className="max-w-[30%] bg-gray-200 rounded-lg">
          <img
            src={product.images[0]}
            alt={product.productName}
            className="w-full h-auto rounded-lg mt-4"
          />
        </div>

        <div className="max-w-[60%] w-full">
          <h1 className="text-[26px] font-bold uppercase">
            {product.productName}
          </h1>

          <p className="text-gray-500 text-[12px]">{product.brand}</p>

          {product?.volumes.length === 1 ? (
            <div className="flex flex-col gap-2 w-full mt-10">
              <p className="text-lg font-semibold text-gray-800 flex items-center">
                Цена:
                <span className="text-[#fa5592] font-bold ml-1">
                  {selectedVolume?.price || product?.volumes[0]?.price} ₴
                </span>
              </p>
              <p className="text-md font-medium text-gray-700">
                Объем:
                <span className="font-semibold ml-1">
                  {selectedVolume?.volume || product?.volumes[0]?.volume} мл
                </span>
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col pb-6 mt-3">
              <p className="text-lg font-semibold text-gray-800 my-4 flex items-center">
                Цена:
                <span className="text-[#fa5592] font-bold ml-1 ">
                  {selectedVolume?.price || product?.volumes[0]?.price} ₴
                </span>
              </p>
              <label
                htmlFor="volume"
                className="mb-2 text-md font-medium text-gray-700"
              >
                🔽 Выберите объем:
              </label>
              <select
                id="volume"
                className="w-[160px] p-2 border rounded-lg shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-[#fa5592] focus:outline-none"
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

          <div className="mt-4 flex gap-8 items-center">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 border border-gray-300 bg-[#fb5e98] hover:bg-[#f0377b] text-white rounded-lg transition-colors duration-300"
            >
              Купить
            </button>
            <Heart
              size={23}
              fill={isFavorite ? "#fa5592" : "none"}
              color="#fa5592"
              className="cursor-pointer"
              onClick={handleFavoriteClick}
            />
          </div>

          <p className="mt-4 text-lg text-gray-500">{product.description}</p>

          <div className="mt-10 tetx-[14px] text-gray-500">
            <p>Страна: {product.country}</p>

            {product.purpose.map((item, index) => (
              <div key={index}>
                <p>Назначение: {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;
