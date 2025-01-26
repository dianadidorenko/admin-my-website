import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import "swiper/swiper-bundle.css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import left from "../assets/header-bg/left.jpg";
// import right from "../assets/header-bg/right.jpg";
import first from "../assets/slider-banner/1.jpg";
import second from "../assets/slider-banner/2.jpg";
import third from "../assets/slider-banner/3.jpg";
import fourth from "../assets/slider-banner/4.jpg";
import logo from "../assets/1.jpg";

const swiperNames = [
  { name: "В путешествие", img: first },
  { name: "Для жирной кожи", img: second },
  { name: "Антивозрастное", img: third },
  { name: "Восстановление волос", img: fourth },
];

const Banner = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseDialog = () => setIsOpen(false);

  return (
    <div className="relative flex flex-col md:flex-row-reverse h-screen w-full">
      {/* Левое изображение */}
      <div className="w-full md:w-1/2 h-[50%] md:h-full flex items-center justify-center">
        <img
          // src={right}
          src={logo}
          alt="Right"
          className="w-full h-full object-cover object-top md:rounded-ee-[50px]"
        />
      </div>

      {/* Правое изображение */}
      <div className="relative w-full md:w-1/2 h-[50%] md:h-full flex items-center justify-center">
        <img
          src={left}
          alt="Left"
          className="w-full h-full object-cover rounded-b-[50px] md:rounded-bl-[50px] md:rounded-br-[0px]"
        />
        <div className="absolute top-[-60px] md:top-[20%] left-[50%] transform -translate-x-1/2">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            spaceBetween={30}
            speed={200}
            className="flex flex-row p-4 max-w-[190px] mx-auto lg:px-0 relative text-[14px]"
          >
            {swiperNames.map((slide, index) => (
              <SwiperSlide className="rounded-xl" key={index}>
                <div className="flex flex-col gap-2 items-center cursor-pointer">
                  <img
                    src={slide.img}
                    alt={slide.name}
                    className="h-[180px] w-[180px] md:h-[280px] object-cover rounded-xl"
                  />
                  <p className="font-medium text-[12px] md:text-[14px]">
                    [ {slide.name} ]
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-[20px]">
        <p className="text-nowrap uppercase text-[28px] md:text-[42px] text-center text-customGray font-bold md:font-extrabold tracking-[-1.5px] leading-[30px] md:leading-[42px]">
          скидки до 40% на весь <br /> ассортимент
        </p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-1 text-[15px] font-medium border border-[#1e1e1e] rounded-[90px] py-[1px] px-[6px]">
              <Plus
                fill="#fa5592"
                color="#fa5592"
                size={15}
                className="mb-[2px]"
              />
              Подробнее
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[470px] px-10">
            <DialogHeader>
              <DialogTitle className="text-[24px] uppercase leading-[25px]">
                Получите самые выгодные <br /> цены в Capricos
              </DialogTitle>
              <DialogDescription className="py-4">
                <p>
                  При покупке от 2 шт любого товара — скидка 20% + <br />{" "}
                  промокод 15%
                </p>
                <p>
                  Сумма от 2000 грн. любого товара — скидка 25% + <br />{" "}
                  промокод 15%
                </p>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mb-4">
              <Link
                to={"#catalog"}
                onClick={handleCloseDialog}
                className="flex items-center gap-1 text-[15px] font-medium border border-[#1e1e1e] rounded-[90px] py-[1px] px-[6px]"
              >
                <Plus
                  fill="#fa5592"
                  color="#fa5592"
                  size={15}
                  className="mb-[2px]"
                />
                Перейти в каталог
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Banner;
