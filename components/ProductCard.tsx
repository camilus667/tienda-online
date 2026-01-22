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
      <div className="relative mb-2 overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className={`relative ${IMAGE_ASPECT_RATIO} cursor-pointer`} onClick={handleOpen}>
          <img
            src={product.imagen || "https://placehold.co/400x400?text=No+Image"}
            alt={product.nombre}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
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
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          {/* Heart Button (Mockup) */}
          <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors border border-gray-100 dark:border-gray-600">
            <Heart className="w-5 h-5" />
          </button>
          {/* Add Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleOpen(); }}
            disabled={!hasStock}
            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 ${hasStock ? 'bg-primary text-white hover:bg-primary-dark border-2 border-white dark:border-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* CONTENIDO TEXTO */}
      <div className="px-1 flex flex-col gap-1 cursor-pointer" onClick={handleOpen}>
        {/* Precio Destacado */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white leading-none">{CURRENCY} {product.precio}</span>
        </div>

        {/* Promo (Mockup - si existe campo en el futuro usarlo) */}
        {/* <p className="text-[10px] sm:text-xs text-secondary font-semibold">Oferta Valida Hasta Agotar Stock</p> */}

        {/* Título y Unidad */}
        <h3 className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium leading-tight line-clamp-2 min-h-[2.5em]">{product.nombre}</h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {displayCategory} {product.color ? `• ${product.color}` : ''}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;