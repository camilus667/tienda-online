import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { CURRENCY, IMAGE_ASPECT_RATIO, IMAGE_VERTICAL_ALIGN } from '../constants';
import { createSlug } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onOpen?: () => void; // Deprecated but kept for compatibility if needed
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const hasStock = product.stock > 0;
  // Get first category safely
  const displayCategory = Array.isArray(product.categoria)
    ? product.categoria[0].trim()
    : (product.categoria as string || '').split(';')[0].trim();

  const handleOpen = () => {
    const slug = createSlug(product.nombre);
    navigate(`/producto/${slug}`);
  };

  return (
    <div className={`group flex flex-col ${!hasStock ? 'opacity-75' : ''}`}>
      {/* IMAGEN Y BOTONES FLOTANTES */}
      {/* IMAGEN Y BOTONES FLOTANTES */}
      <div className="relative mb-3 overflow-hidden rounded-[20px] bg-gray-100 dark:bg-gray-800 shadow-none transition-transform active:scale-[0.98]">
        <div className={`relative ${IMAGE_ASPECT_RATIO} cursor-pointer`} onClick={handleOpen}>
          <img
            src={product.imagen || "https://placehold.co/400x400?text=No+Image"}
            alt={product.nombre}
            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-95 hover:opacity-100 transition-opacity"
            style={{ objectPosition: `center ${IMAGE_VERTICAL_ALIGN}` }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sin+Foto' }}
          />
          {!hasStock && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl">
                AGOTADO
              </span>
            </div>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 z-10">
          {/* Heart Button */}
          <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* CONTENIDO TEXTO */}
      <div className="px-1 flex flex-col gap-0.5 cursor-pointer" onClick={handleOpen}>

        {/* Título */}
        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">{product.nombre}</h3>

        {/* Precio */}
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          {CURRENCY} {product.precio}.00
        </div>

        {/* Color Dots (Simulated based on context or static for bloom style) */}
        <div className="flex gap-1.5 mt-1.5">
          <span className="w-3 h-3 rounded-full bg-black dark:bg-white border border-gray-200 dark:border-gray-600"></span>
          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
          {product.color && <span className="text-[10px] text-gray-400 ml-1 capitalize flex items-center">{product.color}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;