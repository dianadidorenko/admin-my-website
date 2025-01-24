const Advantages = () => {
  const advantages = [
    "99% продукции в наличии на складе",
    "Официальный дистрибьютор",
    "Качественная и надежная упаковка",
    "Лучшие цены на рынке",
    "Работаем более 11 лет",
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 mt-[20px] font-semibold text-center">
      {advantages.map((advantage, index) => (
        <div
          key={index}
          className="flex items-center justify-center rounded-[40px] p-8 sm:p-6 bg-white"
        >
          {advantage}
        </div>
      ))}
    </div>
  );
};

export default Advantages;
