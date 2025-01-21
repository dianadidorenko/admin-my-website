import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "./Container";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/categories`
      );

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
      <h1 id="catalog" className="text-[42px] font-semibold mb-[40px] uppercase tracking-[3px]">
        Каталог
      </h1>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7">
        {categories.map((category) => (
          <div
            key={category._id}
            className="w-full flex flex-col p-2 items-center"
          >
            <div className="relative w-[90px] h-[140px] hover:w-[140px] duration-300 overflow-hidden border-[4px] shadow-lg border-gray-300 rounded-full">
              <img
                src={
                  `${import.meta.env.VITE_BASE_URL}${category.image}` ||
                  "https://placehold.co/600x400/EEE/31343C"
                }
                alt={category.name}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
              />

              {/* Кнопки редактирования и удаления */}
              <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button className="text-blue-500 hover:text-blue-700 mx-2 bg-white/50 p-2 rounded-full duration-300">
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <span className="text-lg flex items-center justify-between mt-2">
              <span className="font-bold mr-1">[</span>
              <span className="text-center">{category.name}</span>
              <span className="font-bold ml-1">]</span>
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Categories;
