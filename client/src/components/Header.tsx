import { useState, useContext, useEffect } from "react";
import { StoreContext } from "../context/storeContext";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { GrUserFemale } from "react-icons/gr";
import { Flame, Heart } from "lucide-react";
import { TbLayoutGridFilled } from "react-icons/tb";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import logo from "../assets/logo.svg";
import axios from "axios";
import { config } from "../../config";
import { Product } from "@/lib/types";
import toast from "react-hot-toast";

const Header = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReducedWidth, setIsReducedWidth] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [openFavorite, setOpenFavorite] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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

  // Проверка сессии пользователя
  const checkAuth = () => {
    if (!token) return;
    axios
      .get(`${config.baseUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setToken(null);
          localStorage.removeItem("token");
          toast.error("Сессия истекла. Пожалуйста, войдите снова.");
          navigate("/login");
        }
      });
  };

  // Функция загрузки всех товаров
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/products`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Ошибка загрузки всех товаров:", error);
    }
  };

  // Загрузка избранного
  const fetchWishlist = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${config?.baseUrl}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data.wishlist || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setToken(null);
        localStorage.removeItem("token");
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
        navigate("/login");
      } else {
        console.error("Ошибка получения списка избранного:", error);
      }
    }
  };

  // Переход к якорной ссылке
  const handleScrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  // Изменение лого в зависимости от ширины экрана и скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    const handleResize = () => {
      setIsReducedWidth(window.innerWidth < 1100);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Удаление товара из избранного
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

  // Фильтрация товаров на клиенте (без запроса на сервер)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const regex = new RegExp(query, "i");
    const filteredProducts = products.filter(
      (product) =>
        regex.test(product.productName) ||
        regex.test(product.brand) ||
        regex.test(product.country)
    );

    setSearchResults(filteredProducts);
  };

  // Очистка поиска
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Загрузка данных
  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    fetchCart();
    checkAuth();
  }, [token]);

  return (
    <header
      className={`${
        window.location.pathname === "/"
          ? "fixed z-20 top-0 left-0"
          : "sticky z-20 top-0 left-0"
      } w-full transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm font-medium text-[14px] flex items-center justify-between px-2 sm:px-8 py-4`}
    >
      <div className="hidden sm:flex items-center gap-4 flex-1 pr-4">
        <button
          onClick={() => handleScrollToSection("catalog")}
          className="hidden sm:flex gap-1 items-center hover:text-[#fa5592] duration-300"
        >
          <TbLayoutGridFilled fill="black" size={16} className="mb-[1px]" />
          Каталог
        </button>
        <Link
          to={"/bestsellers"}
          className="hidden sm:flex gap-1 items-center hover:text-[#fa5592] duration-300"
        >
          <Flame
            fill="#fa5592"
            color="#fa5592"
            size={15}
            className="mb-[1px]"
          />
          Хиты
        </Link>
        <button
          onClick={() => handleScrollToSection("podborki")}
          className="hover:text-[#fa5592] duration-300 hidden md:block"
        >
          Подборки
        </button>
        <Link
          to={"/info"}
          className="hover:text-[#fa5592] duration-300 hidden lg:block"
        >
          Покупателям
        </Link>
        <Link
          to={"#contacts"}
          className="hover:text-[#fa5592] duration-300 hidden xl:block"
        >
          Контакты
        </Link>
      </div>

      <Link to={"/"} className="md:flex-shrink-0">
        <img
          src={logo}
          alt="logo"
          className={`transition-all duration-300 ${
            isReducedWidth ? "h-[20px]" : isScrolled ? "h-[40px]" : "h-[70px]"
          }`}
        />
      </Link>

      <div className="flex items-center gap-4 flex-1 justify-end pl-2">
        {/* Значок поиска */}
        <button onClick={() => setOpenSearch(true)} className="cursor-pointer">
          <Search size={20} className="text-gray-700 hover:text-gray-900" />
        </button>

        {/* Избранное (отображаем только если есть токен) */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Heart
            size={15}
            fill="#fa5592"
            color="#fa5592"
            className="mb-[1px]"
            onClick={() => setOpenFavorite(!openFavorite)}
          />
          <span className="flex items-center">
            <span>[</span>
            <span>{token ? wishlist.length : 0}</span>
            <span>]</span>
          </span>
        </div>

        {/* Корзина (отображаем только если есть токен) */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="hover:text-[#fa5592] duration-300"
            onClick={() => setOpenCart(!openCart)}
          >
            Корзина
          </div>
          <span className="flex items-center">
            <span>[</span>
            <span>{token ? cartItems.length : 0}</span>
            <span>]</span>
          </span>
        </div>

        <div
          className="cursor-pointer shadow hover:shadow-md hover:shadow-pink-400 duration-300 rounded-full p-[2px] bg-gradient-to-r from-purple-100 to-pink-300"
          onClick={() => (token ? navigate("/profile") : navigate("/login"))}
        >
          <GrUserFemale size={22} color="#fa5592" className="rounded-full" />
        </div>
      </div>

      {/* Попап избранного */}
      <Drawer open={openFavorite} onOpenChange={setOpenFavorite}>
        <DrawerContent>
          <DrawerClose asChild>
            <div className="absolute top-2 right-2 cursor-pointer">
              <X size={30} />
            </div>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle className="text-[18px] md:text-[24px] font-semibold uppercase md:tracking-[3px] border-b pb-2">
              Избранное
            </DrawerTitle>
            <DrawerDescription>
              {wishlist.length === 0 ? (
                <div className="text-center text-gray-500">Список пуст</div>
              ) : (
                <div className="overflow-y-scroll py-4">
                  {wishlist.map((item) => (
                    <p
                      key={item._id}
                      className="relative py-2 border-b flex flex-col lg:flex-row items-center gap-2"
                    >
                      <Link
                        to={`/product/${item._id}`}
                        onClick={() => setOpenFavorite(false)}
                      >
                        <img
                          src={item.images?.[0]}
                          alt={item.productName}
                          className="w-[120px] h-[120px]"
                        />
                      </Link>

                      <div className="max-w-[300px] flex flex-col items-center lg:items-start gap-1">
                        <span className="font-semibold text-center lg:text-start">
                          {item.productName}
                        </span>
                        <span className="text-[14px]">{item.brand}</span>
                        <span className="font-medium">{item.country}</span>
                        <span className="font-bold text-[17px] text-gray-500">
                          {item.volumes?.[0].price} ₴
                        </span>
                      </div>

                      <X
                        size={17}
                        className="absolute top-[10px] right-[5px] cursor-pointer"
                        onClick={() => handleRemoveFromWishlist(item._id)}
                      />
                    </p>
                  ))}
                </div>
              )}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>

      {/* Попап корзины */}
      <Drawer open={openCart} onOpenChange={setOpenCart}>
        <DrawerContent>
          <DrawerClose asChild>
            <div className="absolute top-2 right-2 cursor-pointer">
              <X size={30} />
            </div>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle className="text-[18px] md:text-[24px] font-semibold uppercase md:tracking-[3px] border-b pb-2">
              Корзина
            </DrawerTitle>
            <DrawerDescription>
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 text-lg font-medium py-6">
                  🛒 Ваша корзина пуста
                </div>
              ) : (
                <div className="overflow-y-auto p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product._id}
                      className="relative flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
                    >
                      <Link
                        to={`/product/${item.product._id}`}
                        onClick={() => setOpenCart(false)}
                      >
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.productName}
                          className="w-[90px] h-[90px] object-cover cursor-pointer"
                        />
                      </Link>

                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold">
                          {item.product.productName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product.brand}
                        </p>
                        <p className="text-sm text-gray-600">
                          Страна: {item.product.country}
                        </p>
                        <p className="text-md font-medium text-gray-700">
                          Цена:{" "}
                          <span className="text-pink-500 font-bold">
                            {item.product.volumes?.[0].price} ₴
                          </span>
                        </p>

                        <div className="flex items-center">
                          <button
                            onClick={() => decreaseQuantity(item.product._id)}
                            className="py-1 px-[10px] flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 transition"
                          >
                            -
                          </button>
                          <span className="text-md font-semibold px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.product._id)}
                            className="py-1 px-[9px] flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 transition"
                          >
                            +
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

                  <div className="flex justify-between items-center mt-4 p-4 border-t">
                    <h3 className="text-lg font-semibold">Сумма заказа:</h3>
                    <span className="text-xl font-bold text-[#fa5592]">
                      {calculateTotalPrice()} ₴
                    </span>
                  </div>

                  <Link
                    to={"/cart"}
                    className="bg-[#fa5592] text-white py-2 px-3 rounded-lg font-semibold text-lg shadow-md hover:bg-pink-600 transition duration-300"
                    onClick={() => setOpenCart(!openCart)}
                  >
                    Оформить заказ
                  </Link>
                </div>
              )}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>

      {/* Попап поиска */}
      <Drawer open={openSearch} onOpenChange={setOpenSearch}>
        <DrawerContent>
          <DrawerClose asChild>
            <div className="absolute top-2 right-2 cursor-pointer">
              <X size={30} />
            </div>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle className="text-[18px] md:text-[24px] font-semibold uppercase">
              Поиск товаров
            </DrawerTitle>
            <DrawerDescription>
              <div className="relative mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Введите название, бренд или страну..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400"
                />
                {searchQuery && (
                  <X
                    size={18}
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={clearSearch}
                  />
                )}
              </div>

              {/* Результаты поиска */}
              {searchResults.length > 0 ? (
                <div className="w-full overflow-y-auto mt-4">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="flex items-center p-3 border-b hover:bg-gray-100 transition duration-200"
                      onClick={() => setOpenSearch(false)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="w-[50px] h-[50px] object-cover rounded-md"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {product.productName}
                        </p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                searchQuery && (
                  <span className="text-center text-gray-500 mt-4">
                    Ничего не найдено
                  </span>
                )
              )}
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </header>
  );
};

export default Header;
