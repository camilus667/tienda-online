export interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string[];
  imagen: string;
  stock: number;
  descripcion: string;
  tallas: string[];
  color: string;
  imagenes_adicionales?: string[];
}

export interface CartItem extends Product {
  key: string; // Unique identifier (id + size)
  size: string;
  quantity: number;
}

export interface StoreConfig {
  name: string;
  currency: string;
  phoneNumber: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}