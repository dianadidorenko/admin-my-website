import { Flame, Heart, Search } from "lucide-react";
import { TbLayoutGridFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed z-20 w-full top-0 left-0 bg-[#f5f5f510] font-medium text-[15px] flex items-center justify-between px-8 py-2">
      <div className="flex items-center gap-4 flex-1 pr-2">
        <Link
          to={"#catalog"}
          className="flex gap-1 items-center hover:text-[#fa5592] duration-300"
        >
          <TbLayoutGridFilled fill="black" size={16} className="mb-[3px]" />
          Каталог
        </Link>
        <Link
          to={"/bestsellers"}
          className="flex gap-1 items-center hover:text-[#fa5592] duration-300"
        >
          <Flame
            fill="#fa5592"
            color="#fa5592"
            size={15}
            className="mb-[3px]"
          />
          Хиты
        </Link>
        <Link to={"#podborki"} className="hover:text-[#fa5592] duration-300">
          Подборки
        </Link>
        <Link to={"/info"} className="hover:text-[#fa5592] duration-300">
          Покупателям
        </Link>
        <Link to={"#contacts"} className="hover:text-[#fa5592] duration-300">
          Контакты
        </Link>
      </div>

      <Link to={"/"} className="flex-shrink-0">
        <img
          src={logo}
          alt="logo"
          className={`transition-all duration-300 ${
            isScrolled ? "h-12" : "h-[70px]"
          }`}
        />
      </Link>

      <div className="flex items-center gap-4 flex-1 justify-end pl-2">
        <Search size={15} className="cursor-pointer mb-[2px]" />
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
