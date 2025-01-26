import first from "../assets/distribuitors/gourmet.png";
import second from "../assets/distribuitors/egia.svg";
import third from "../assets/distribuitors/icon.png";
import fourth from "../assets/distribuitors/keralex.png";
import fifth from "../assets/distribuitors/la-bio.png";
import sixth from "../assets/distribuitors/protokeratin.png";
import seventh from "../assets/distribuitors/gewhol.png";

const images = [
  { src: first },
  { src: second },
  { src: third },
  { src: fourth },
  { src: fifth },
  { src: sixth },
  { src: seventh },
];

const Distribuitor = () => {
  return (
    <div className="text-center my-[100px]">
      <h2 className="max-w-[460px] font-semibold mx-auto leading-[25px] uppercase text-[26px]">
        Специализируемся на профессиональной уходовой косметике и космецевтике
        для лица, тела и волос
      </h2>
      <div className="py-16 overflow-hidden">
        <div className="w-full flex gap-20 animate-marquee whitespace-nowrap">
          {images.concat(images).map((img, index) => (
            <img
              src={img.src}
              key={index}
              alt="pic"
              className="max-h-[35px] object-cover h-[100px]"
            />
          ))}
        </div>
      </div>
      <p className="max-w-[460px] mx-auto text-gray-600/80 leading-[23px]">
        Мы официальный дистрибьютор и гарантируем сертифицированную продукцию
        высокого качества.
      </p>
      <p className="mt-4 max-w-[460px] mx-auto text-gray-600/80 leading-[23px]">
        Мы радуем вас специальными предложениями и акциями. К каждому клиенту у
        нас индивидуальный подход, и вы всегда можете обратиться к нашим
        менеджерам с вопросом. Организуем быструю и удобную доставку СДЭКом
      </p>
    </div>
  );
};

export default Distribuitor;
