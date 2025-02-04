import { useEffect, useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { config } from "../../config";
import Container from "../components/Container";
import ProductCard from "../components//ProductCard";
import { Product } from "@/lib/types";
import { useNavigate } from "react-router-dom";

const MustHave = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const filteredProducts = products.filter((item) => item.hit);

  const getHits = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/products`);

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error("Ошибка при получении товаров");
      }
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      toast.error("Ошибка при получении товаров");
    }
  };

  useEffect(() => {
    getHits();
  }, []);

  // Переход к якорной ссылке
  const handleScrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  return (
    <Container className="my-[50px]">
      <div className="flex flex-col">
        <button
          onClick={() => handleScrollToSection("podborki")}
          className="flex items-center gap-2 mb-[60px] text-[14px]"
        >
          <ArrowLeftCircle fill="black" color="white" size={20} />
          Назад к подборкам
        </button>
        <h1
          id="novelties"
          className="text-[28px] md:text-[42px] font-semibold uppercase md:tracking-[3px] flex items-center gap-2 leading-[40px]"
        >
          Ежедневный маст-хэв
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[40px]">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </Container>
  );
};

export default MustHave;
