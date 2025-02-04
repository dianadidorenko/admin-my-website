import axios from "axios";
import { config } from "../../config";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/storeContext";
import { X } from "lucide-react";

const tabs = [
  { id: "profile", label: "Контактная информация" },
  { id: "orders", label: "История заказов" },
  { id: "wishlist", label: "Список желаний" },
];

interface Volume {
  volume: string;
  price: string;
  weight: string;
}

interface Product {
  _id: string;
  productName: string;
  brand: string;
  country: string;
  volumes: Volume[];
  images: string[];
}

interface User {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthday: string;
  city: string;
  street: string;
  house: string;
  appartment: string;
  index: string;
}

const Profile: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const { token, setToken } = useContext(StoreContext)!;
  const navigate = useNavigate();
  const [id, setId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  const [formData, setFormData] = useState<User>({
    name: "",
    surname: "",
    email: "",
    phone: "",
    birthday: "",
    city: "",
    street: "",
    house: "",
    appartment: "",
    index: "",
  });

  const handleInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized. Please log in.");
        setIsAuthenticated(false);
        return;
      }

      const response = await axios.get(`${config?.baseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const user = response.data.user;
        setId(user.id);
        setFormData({
          name: user.name || "",
          surname: user.surname || "",
          email: user.email,
          phone: user.phone || "",
          birthday: user.birthday || "",
          city: user.city || "",
          street: user.street || "",
          house: user.house || "",
          appartment: user.appartment || "",
          index: user.index || "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching user info:", error);

      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  useEffect(() => {
    handleInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }

      const response = await axios.put(
        `${config?.baseUrl}/users/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    try {
      await axios.delete(
        `${config?.baseUrl}/users/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Ошибка удаления из избранного:", error);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${config?.baseUrl}/users/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishlist(response.data.wishlist || []);
      } catch (error) {
        console.error("Ошибка получения списка избранного:", error);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleDeleteAccount = async () => {
    if (!token) {
      toast.error("Вы не авторизованы.");
      return;
    }

    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить аккаунт?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${config.baseUrl}/users/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      setToken(null);

      toast.success("Аккаунт успешно удалён.");
      navigate("/");
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      toast.error("Не удалось удалить аккаунт. Попробуйте ещё раз.");
    }
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center text-red-500 font-semibold">
          Ваша сессия истекла. Пожалуйста,{" "}
          <a href="/login" className="text-blue-500 underline">
            авторизуйтесь снова
          </a>
          .
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold text-center mb-6">
                Контактная информация
              </h1>
              <form onSubmit={handleSubmit} className="max-w-[1024px] w-full">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Фамилия
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="p-2 mt-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm hover:cursor-not-allowed"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Телефон
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="birthday"
                      className="block text-sm font-medium text-gray-700"
                    >
                      День рождения
                    </label>
                    <input
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Город
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Улица
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-full mb-[14px]">
                    <label
                      htmlFor="house"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Дом
                    </label>
                    <input
                      type="text"
                      id="house"
                      name="house"
                      value={formData.house}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="appartment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Квартира
                    </label>
                    <input
                      type="text"
                      id="appartment"
                      name="appartment"
                      value={formData.appartment}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="index"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Индекс
                    </label>
                    <input
                      type="text"
                      id="index"
                      name="index"
                      value={formData.index}
                      onChange={handleChange}
                      className="p-2 mt-1 w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                >
                  Обновить профиль
                </button>
              </form>
            </div>
          </>
        );
      case "wishlist":
        return (
          <>
            {wishlist.length === 0 ? (
              <p className="text-center text-gray-500">Список пуст</p>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-6">Список желаний</h1>
                <ul>
                  {wishlist.map((item) => (
                    <li
                      key={item._id}
                      className="relative py-4 border-b flex items-center gap-2 max-w-[500px]"
                    >
                      <img
                        src={item.images?.[0]}
                        alt={item.productName}
                        className="w-[150px] h-[150px]"
                      />
                      <div className="max-w-[300px] flex flex-col gap-1">
                        <p className=" font-semibold">{item.productName}</p>
                        <p className="text-[14px]">{item.brand}</p>
                        <p className="font-medium">{item.country}</p>
                        <p className="font-bold text-[17px] text-gray-500">
                          {item.volumes?.[0].price} ₴
                        </p>
                      </div>

                      <X
                        size={17}
                        className="absolute top-0 right-0 cursor-pointer"
                        onClick={() => handleRemoveFromWishlist(item._id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}{" "}
          </>
        );
      case "orders":
        return (
          <>
            <h1 className="text-xl font-bold">История заказов</h1>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex py-20">
        <div className="w-1/3 pl-10 border-r">
          <ul className="border-r border-r-gray-300">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`relative cursor-pointer p-2 ${
                  activeTab === tab.id
                    ? "absolute right-[-1.5px] border-r-2 border-r-black/60 text-[#fa5592] hover:text-[#fa5592] duration-300"
                    : "absolute right-[-1.5px] hover:text-[#fa5592] duration-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start">
            <button
              onClick={handleDeleteAccount}
              className="mt-8 pl-[10px] text-red-400 hover:text-black duration-300"
            >
              Удалить мой аккаунт
            </button>
            <button
              onClick={logout}
              className="mt-4 pl-[10px] text-gray-400 hover:text-black duration-300"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="w-full pl-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
