import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { config } from "../../config";
import Container from "./Container";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

interface Volume {
  volume: string;
  price: string;
  weight: string;
}

interface Product {
  _id: string;
  productName: string;
  brand: string;
  hit: boolean;
  images: string[];
  volumes: Volume[];
}

const Novelties = () => {
  const [products, setProducts] = useState<Product[]>([]);

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
          className="text-[28px] md:text-[42px] font-semibold uppercase md:tracking-[3px]"
        >
          Новинки
        </h1>
        <Link
          to={"#catalog"}
          className="flex items-center gap-1 text-[15px] font-medium border border-[#1e1e1e] rounded-[90px] py-[1px] px-[6px]"
        >
          <Plus fill="#fa5592" color="#fa5592" size={15} className="mb-[2px]" />
          Все новинки
        </Link>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[40px]">
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </Container>
  );
};

export default Novelties;
