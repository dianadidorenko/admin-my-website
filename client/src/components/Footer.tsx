import Container from "./Container";
import image from "../assets/footer.jpg";
import logo from "../assets/CAPRICOS.svg";
import { Mail, Phone } from "lucide-react";
import {
  TbBrandTelegram,
  TbBrandWhatsapp,
  TbLayoutGridFilled,
} from "react-icons/tb";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Container>
      <div className="bg-black/85 p-6 text-white rounded-[40px]">
        {/* Фоновое изображение */}
        <img
          src={image}
          alt="footer background"
          className="w-full rounded-[30px]"
        />

        <div className="py-14 gap-10 lg:gap-0 flex flex-col lg:flex-row justify-between">
          {/* Левая часть - Вопросы */}
          <div className="flex flex-col gap-4">
            <p className="uppercase text-[28px] leading-[30px] text-white">
              Остались вопросы? <br /> Не нашли нужный товар?
            </p>
            <p className="text-white/70 leading-[20px]">
              Свяжитесь с нами, и мы ответим <br /> на ваш вопрос в течение 20
              минут
            </p>
            <div>
              <button className="flex items-center gap-1 border border-white rounded-full py-1 px-2 text-[14px] text-white hover:bg-white hover:text-black transition">
                <Mail size={15} />
                Написать
              </button>
            </div>
          </div>

          {/* Правая часть - Контакты и ссылки */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Контакты */}
            <div className="flex flex-col gap-3">
              <h3 className="uppercase">Свяжитесь с нами</h3>
              <a
                href="tel:+380974379424"
                className="flex items-center gap-2 text-white/60 hover:text-white transition"
              >
                <Phone size={15} />
                +380974379424
              </a>
              <a
                href="mailto:info@capricos.shop"
                className="flex items-center gap-2 text-white/60 hover:text-white transition"
              >
                <Mail size={15} />
                info@capricos.shop
              </a>
              <a
                href="https://t.me/username"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center text-white/60 hover:text-white transition"
              >
                <TbBrandTelegram size={17} />
                Telegram
              </a>
              <a
                href="https://wa.me/380974379424"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center text-white/60 hover:text-white transition"
              >
                <TbBrandWhatsapp size={17} />
                WhatsApp
              </a>
            </div>

            {/* Каталог */}
            <div className="flex flex-col gap-3">
              <h3 className="uppercase flex items-center gap-1">
                <TbLayoutGridFilled
                  fill="white"
                  size={16}
                  className="mb-[1px]"
                />
                Каталог
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-20 w-full">
                <div className="flex flex-col gap-3">
                  <Link
                    to="/hair-care"
                    className="text-white/60 hover:text-white transition"
                  >
                    Уход для волос
                  </Link>
                  <Link
                    to="/face-care"
                    className="text-white/60 hover:text-white transition"
                  >
                    Уход для лица
                  </Link>
                  <Link
                    to="/body-care"
                    className="text-white/60 hover:text-white transition"
                  >
                    Уход для тела
                  </Link>
                  <Link
                    to="/hand-foot-care"
                    className="text-white/60 hover:text-white transition"
                  >
                    Уход для рук и ног
                  </Link>
                  <Link
                    to="/men-care"
                    className="text-white/60 hover:text-white transition"
                  >
                    Уход для мужчин
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/travel-size"
                    className="text-white/60 hover:text-white transition"
                  >
                    Тревел сайз
                  </Link>
                  <Link
                    to="/sun-protection"
                    className="text-white/60 hover:text-white transition"
                  >
                    Защита от солнца
                  </Link>
                  <Link
                    to="/new"
                    className="text-white/60 hover:text-white transition"
                  >
                    Новинки
                  </Link>
                  <Link
                    to="/bestsellers"
                    className="text-white/60 hover:text-white transition"
                  >
                    Хиты продаж
                  </Link>
                  <Link
                    to="/collections"
                    className="text-white/60 hover:text-white transition"
                  >
                    Подборки
                  </Link>
                </div>
              </div>
            </div>

            {/* Клиентам */}
            <div className="flex flex-col gap-3">
              <h3 className="uppercase">Клиентам</h3>
              <Link
                to="/delivery"
                className="text-white/60 hover:text-white transition"
              >
                Доставка и оплата
              </Link>
              <Link
                to="/warranty"
                className="text-white/60 hover:text-white transition"
              >
                Гарантии и возврат
              </Link>
              <Link
                to="/about-us"
                className="text-white/60 hover:text-white transition"
              >
                О нас
              </Link>
              <Link
                to="/requisites"
                className="text-white/60 hover:text-white transition"
              >
                Реквизиты
              </Link>
            </div>
          </div>
        </div>

        {/* Логотип */}
        <img src={logo} alt="logo" className="mx-auto mt-6" />
      </div>
    </Container>
  );
};

export default Footer;
