import { Plus } from "lucide-react";
import left from "../assets/header-bg/left.jpg";
import right from "../assets/header-bg/right.jpg";
import first from "../assets/slider-banner/1.jpg";
import second from "../assets/slider-banner/2.jpg";
import third from "../assets/slider-banner/3.jpg";
import fourth from "../assets/slider-banner/4.jpg";
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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Autoplay } from "swiper/modules";

const Banner = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseDialog = () => setIsOpen(false);

  return (
    <div className="relative flex">
      {/* Левое изображение */}
      <img src={left} alt="Left" className="w-1/2 h-full object-cover" />
      {/* Правое изображение */}
      <img src={right} alt="Right" className="w-1/2 h-full object-cover" />

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-y-[20px]">
        <p className="uppercase text-[42px] text-center text-customGray font-extrabold tracking-[-1.5px] leading-[42px]">
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

      <div className="absolute top-[200px] left-[20%] transform -translate-x-1/2">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={false}
          slidesPerView={1}
          spaceBetween={30}
          speed={200}
          className="flex flex-row p-4 max-w-[190px] mx-auto lg:px-0 relative text-[14px]"
        >
          <SwiperSlide>
            <div className="flex flex-col gap-2 items-center cursor-pointer">
              <img
                src={first}
                alt="1"
                className="h-[280px] object-cover rounded-lg"
              />
              <p>[ В путешествие ]</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-2 items-center cursor-pointer">
              <img
                src={second}
                alt="2"
                className="h-[280px] object-cover rounded-lg"
              />
              <p>[ Для жирной кожи ]</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-2 items-center cursor-pointer">
              <img
                src={third}
                alt="3"
                className="h-[280px] object-cover rounded-lg"
              />
              <p>[ Антивозрастное ]</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-2 items-center cursor-pointer">
              <img
                src={fourth}
                alt="4"
                className="h-[280px] object-cover rounded-lg"
              />
              <p>[ Восстановление волос ]</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
