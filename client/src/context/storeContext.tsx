import axios from "axios";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { config } from "../../config";
import { CartItem, Product } from "@/lib/types";

interface StoreContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  cartItems: CartItem[];
  fetchCart: () => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  calculateTotalPrice: () => number;
}

export const StoreContext = createContext<StoreContextType | null>(null);

interface StoreProviderProps {
  children: ReactNode;
}

const StoreContextProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${config?.baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cart || []);
    } catch (error) {
      console.error("Ошибка получения корзины:", error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      await axios.post(
        `${config?.baseUrl}/cart/add`,
        { product, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await axios.delete(`${config?.baseUrl}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (error) {
      console.error("Ошибка удаления из корзины:", error);
      throw error;
    }
  };

  const increaseQuantity = async (productId: string) => {
    try {
      await axios.put(
        `${config?.baseUrl}/cart/increase/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.error("Ошибка увеличения количества товара:", error);
      throw error;
    }
  };

  const decreaseQuantity = async (productId: string) => {
    try {
      await axios.put(
        `${config?.baseUrl}/cart/decrease/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.error("Ошибка уменьшения количества товара:", error);
      throw error;
    }
  };

  const calculateTotalPrice = (): number => {
    return cartItems.reduce(
      (sum, item) =>
        sum + Number(item.product.volumes[0].price) * item.quantity,
      0
    );
  };

  return (
    <StoreContext.Provider
      value={{
        token,
        setToken,
        cartItems,
        fetchCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        calculateTotalPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
