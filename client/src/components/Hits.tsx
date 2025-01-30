import { useEffect, useState } from "react";
import { Flame, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { config } from "../../config";
import Container from "./Container";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";

const Hits = () => {
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
    <Container>
      <div className="flex items-center justify-between">
        <h1
          id="novelties"
          className="text-[28px] md:text-[42px] font-semibold uppercase md:tracking-[3px] flex items-center gap-2"
        >
          <div className="bg-black/75 py-[4px] px-1 md:py-[7px] md:px-2">
            <Flame
              fill="white"
              color="white"
              className="w-[12px] h-[11px] md:w-[15px] md:h-[15px] mb-[3px]"
            />
          </div>
          Хиты
        </h1>
        <Link
          to={"#catalog"}
          className="flex items-center gap-1 text-[15px] font-medium border border-[#1e1e1e] rounded-[90px] py-[1px] px-[6px]"
        >
          <Plus fill="#fa5592" color="#fa5592" size={15} className="mb-[2px]" />
          Все хиты
        </Link>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[40px]">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </Container>
  );
};

export default Hits;
