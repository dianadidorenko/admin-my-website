import { Flame, Heart, Search } from "lucide-react";
import { TbLayoutGridFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReducedWidth, setIsReducedWidth] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    const handleResize = () => {
      setIsReducedWidth(window.innerWidth < 1100);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Вызываем сразу, чтобы корректно установить состояние при загрузке
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={`fixed z-20 w-full top-0 left-0 transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm font-medium text-[14px] flex items-center justify-between px-2 sm:px-8 py-4`}
    >
      <div className="hidden sm:flex items-center gap-4 flex-1 pr-4">
        <Link
          to={"#catalog"}
          className="hidden sm:flex gap-1 items-center hover:text-[#fa5592] duration-300"
        >
          <TbLayoutGridFilled fill="black" size={16} className="mb-[3px]" />
          Каталог
        </Link>
        <Link
          to={"/bestsellers"}
          className="hidden sm:flex gap-1 items-center hover:text-[#fa5592] duration-300"
        >
          <Flame
            fill="#fa5592"
            color="#fa5592"
            size={15}
            className="mb-[3px]"
          />
          Хиты
        </Link>
        <Link
          to={"#podborki"}
          className="hover:text-[#fa5592] duration-300 hidden md:block"
        >
          Подборки
        </Link>
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
        <Search size={15} className="hidden sm:block cursor-pointer mb-[2px]" />
        <div className="flex items-center gap-2 cursor-pointer">
          <Heart
            size={15}
            fill="#fa5592"
            color="#fa5592"
            className="mb-[3px]"
          />
          <span className="flex items-center">
            <span>[</span>
            <span>0</span>
            <span>]</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link to={"/cart"} className="hover:text-[#fa5592] duration-300">
            Корзина
          </Link>
          <span className="flex items-center">
            <span>[</span>
            <span>0</span>
            <span>]</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
