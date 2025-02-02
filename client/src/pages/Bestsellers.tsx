import Container from "@/components/Container";
import { Product } from "@/lib/types";
import axios from "axios";
import { ArrowLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { config } from "../../config";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";

const Bestsellers = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const filteredProducts = products.filter((item) => item.hit);

  const getCategories = async () => {
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
    getCategories();
  }, []);
  
  return (
    <Container className="flex flex-col my-10 ">
      <Link to={"/"} className="flex items-center gap-2 mb-[70px] text-[14px]">
        <ArrowLeftCircle fill="black" color="white"size={20} />
        Назад к категориям
      </Link>

      <div>
        <div className="flex items-center justify-between">
          <h1
            id="novelties"
            className="text-[28px] md:text-[42px] font-semibold uppercase md:tracking-[3px] flex items-center gap-2"
          >
            Хиты
          </h1>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[40px]">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Bestsellers;
