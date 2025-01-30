import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { config } from "../../config";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import Container from "./Container";
import { PodborkiItem } from "@/lib/types";

const Podborki = () => {
  const [podborki, setPodborki] = useState<PodborkiItem[]>([]);

  const getPodborki = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/podborki`);
      if (response.data.success) {
        setPodborki(response.data.data);
      } else {
        toast.error("Ошибка при получении подборок");
      }
    } catch (error) {
      console.error("Ошибка при получении подборок:", error);
      toast.error("Ошибка при получении подборок");
    }
  };

  useEffect(() => {
    getPodborki();
  }, []);

  return (
    <Container>
      <div className="bg-black/85 p-6 text-white rounded-[40px] relative">
        <h1 className="text-center text-[26px] leading-[35px] md:text-[42px] md:leading-[42px] tracking-[-0.5px] uppercase font-bold mb-[30px] md:mb-[50px]">
          Собрали для вас подборки <br /> лучших средств
        </h1>
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          spaceBetween={20}
          speed={400}
          loop
          className="flex flex-row p-4 mx-auto lg:px-0"
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 2, spaceBetween: 20 },
          }}
        >
          {podborki?.map((item, index) => (
            <SwiperSlide key={index} className="rounded-xl relative">
              <div className="flex flex-col gap-2 items-center cursor-pointer">
                {/* Контейнер с адаптивной высотой */}
                <div className="w-full h-[300px] sm:h-[450px] md:h-[700px] lg:h-[650px] relative overflow-hidden rounded-[20px] md:rounded-[40px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-10 w-full flex flex-col gap-2 items-center justify-center">
                  <p className="font-medium text-white uppercase text-[20px] md:text-[26px] max-w-[300px] text-center leading-[28px]">
                    {item.name}
                  </p>
                  <Link
                    to={`${config?.baseUrl}/${item.redirectName}`}
                    className="flex items-center justify-center gap-1 text-[12px] md:text-[14px] text-white font-medium border border-white rounded-[90px] py-[1px] px-[6px]"
                  >
                    <Plus
                      fill="#fa5592"
                      color="#fa5592"
                      size={15}
                      className="mb-[2px]"
                    />
                    Посмотреть
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кастомные кнопки навигации */}
        <div
          className="custom-prev bg-[#fa5592] rounded-sm px-[7px] py-[8px] flex items-center justify-center absolute top-1/2 left-[-15px] z-10 transform -translate-y-1/2 cursor-pointer shadow-md hover:bg-[#f0377b] transition-colors duration-300"
          role="button"
        >
          <ArrowLeft size={15} color="white" />
        </div>

        <div
          className="custom-next bg-[#fa5592] rounded-sm px-[7px] py-[8px] flex items-center justify-center absolute top-1/2 right-[-15px] z-10 transform -translate-y-1/2 cursor-pointer shadow-md hover:bg-[#f0377b] transition-colors duration-300"
          role="button"
        >
          <ArrowRight size={15} color="white" />
        </div>
      </div>
    </Container>
  );
};

export default Podborki;
