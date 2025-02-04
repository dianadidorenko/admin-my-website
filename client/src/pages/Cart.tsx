import { StoreContext } from "@/context/storeContext";
import { Minus, Plus, X } from "lucide-react";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    token,
    setToken,
    cartItems,
    fetchCart,
    calculateTotalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(StoreContext)!;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Сессия истекла. Пожалуйста, войдите снова.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        fetchCart();
      } catch (error: any) {
        console.error("Ошибка при получении корзины:", error);

        if (error.response?.status === 401) {
          setToken(null);
          localStorage.removeItem("token");
          toast.error("Сессия истекла. Войдите снова.");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center text-red-500 text-lg font-medium py-6">
        Пожалуйста,{" "}
        <Link to="/login" className="text-blue-500 underline">
          войдите
        </Link>
        , чтобы просмотреть корзину.
      </div>
    );
  }

  return (
    <div>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-medium py-6">
          🛒 Ваша корзина пуста
        </div>
      ) : (
        <div className="max-h-[400px] p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b pb-6">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="relative flex items-center gap-4 p-4 pt-8 border rounded-lg shadow-sm bg-white"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.productName}
                  className="w-[90px] h-[90px] object-cover"
                />

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">
                    {item.product.productName}
                  </h3>
                  <p className="text-sm text-gray-500">{item.product.brand}</p>
                  <p className="text-sm text-gray-600">
                    Страна: {item.product.country}
                  </p>
                  <p className="text-md font-medium text-gray-700">
                    Цена:{" "}
                    <span className="text-pink-500 font-bold">
                      {item.product.volumes?.[0].price} ₴
                    </span>
                  </p>

                  <div className="flex items-center gap-2 pt-3">
                    <button
                      onClick={() => decreaseQuantity(item.product._id)}
                      className="py-1 px-[4px] flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="text-md font-semibold px-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.product._id)}
                      className="py-1 px-[4px] flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <X
                  size={20}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer transition"
                  onClick={() => removeFromCart(item.product._id)}
                />
              </div>
            ))}
          </div>

          <div className="max-w-[400px] mx-auto flex items-center justify-between">
            <div className="flex flex-col justify-between items-center mt-4 p-4">
              <h3 className="text-lg font-semibold pb-3">Сумма заказа:</h3>
              <Link
                to={"/cart"}
                className="bg-[#fa5592] text-white py-2 px-3 rounded-lg font-semibold text-lg shadow-md hover:bg-pink-600 transition duration-300"
              >
                Оформить заказ
              </Link>
            </div>
            <span className="text-xl font-bold text-[#fa5592]">
              {calculateTotalPrice()} ₴
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
