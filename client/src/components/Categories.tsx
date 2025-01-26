import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "./Container";
import { config } from "../../config";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/categories`);

      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
      toast.error("Ошибка при получении категорий");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container>
      <h1
        id="catalog"
        className="text-[28px] md:text-[42px] font-semibold mb-[40px] uppercase md:tracking-[3px]"
      >
        Каталог
      </h1>

      <div className="relative w-full grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative w-full cursor-pointer h-[180px] flex flex-col justify-between pt-3 pl-3 bg-[#f9f9f9] hover:bg-[#f0f0f0] border rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {/* Название категории */}
            <p className="font-normal text-[15px] text-gray-800 leading-[17px]">
              {category.name}
            </p>

            {/* Контейнер для изображения */}
            <div className="absolute bottom-[-1px] right-0 w-[170px] h-[190px] duration-300 overflow-hidden rounded-lg mx-auto">
              <img
                src={
                  category.image || "https://placehold.co/150x150/EEE/31343C"
                }
                alt={category.name}
                className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Иконка в центре изображения */}
            <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button className="text-[#fa5592] hover:text-[#fa5592] bg-white p-2 rounded-full shadow-lg transition duration-300">
                <Eye size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Categories;
