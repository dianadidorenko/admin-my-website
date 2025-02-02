import Container from "@/components/Container";
import { ArrowLeftCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "delivery", label: "Доставка и оплата" },
  { id: "guarantee", label: "Гарантии и возврат" },
];

const Info = () => {
  const [activeTab, setActiveTab] = useState<string>("delivery");

  const renderContent = () => {
    switch (activeTab) {
      case "delivery":
        return (
          <div className="flex flex-col gap-4 leading-[25px] max-w-[750px] text-gray-600">
            <p>
              Доставка происходит с помощью транспортной компании СДЭК. Оформляя
              заказ на сайте, выберите способ доставки «СДЭК самовывоз из пункта
              выдачи» или «СДЭК доставка курьером», оплатите заказ банковской
              картой на сайте.
            </p>
            <p>Сроки доставки: индивидуально в зависимости от региона.</p>
            <p>
              Стоимость доставки рассчитывается индивидуально в зависимости от
              тарифов СДЭК. График работы ПВЗ СДЭК можно узнать на сайте СДЭК
            </p>
            <p>
              Все заказы оплачиваются на сайте банковской картой и только после
              оплаты передаются в транспортную службу.
            </p>
          </div>
        );
      case "guarantee":
        return (
          <div className="flex leading-[25px] max-w-[750px] text-gray-600">
            <p>
              Постановлением Украины от 03.02.2018 г. № 24 утвержден «Перечень
              непродовольственных товаров надлежащего качества, не подлежащих
              обмену», в который входят 14 групп товаров, в т.ч.
              парфюмерно-косметические товары (п. 3). Таким образом,
              обмен/возврат парфюмерно-косметической продукции не предусмотрен.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="flex flex-col my-10">
      <Link to={"/"} className="flex items-center gap-2 mb-[70px] text-[14px]">
        <ArrowLeftCircle fill="black" color="white" size={20} />
        Главная
      </Link>

      <h1 className="text-[28px] md:text-[42px] font-semibold uppercase md:tracking-[3px] flex items-center gap-2">
        Покупателям
      </h1>

      <div className="flex flex-col py-20">
        <div className="flex w-1/3">
          <ul className="flex gap-3 pb-10">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer py-1 px-3 rounded-full ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-transparent hover:text-gray-600 duration-300 border border-black/60"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">{renderContent()}</div>
      </div>
    </Container>
  );
};

export default Info;
