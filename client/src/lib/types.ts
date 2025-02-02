export interface Volume {
  volume: string;
  price: string;
  weight: string;
}

export interface Product {
  _id: string;
  productName: string;
  description: string;
  brand: string;
  hit: boolean;
  country: string;
  volumes: Volume[];
  images: string[];
  purpose: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  _id?: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
}

export interface PodborkiItem {
  _id: string;
  name: string;
  redirectName: string;
  image: string;
}
