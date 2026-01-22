import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';
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
    <div className={`bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-all group ${!hasStock ? 'opacity-75' : ''}`}>
      <div className={`relative ${IMAGE_ASPECT_RATIO} overflow-hidden cursor-pointer`} onClick={handleOpen}>
        <img 
            src={product.imagen || "https://placehold.co/400x400?text=No+Image"} 
            alt={product.nombre} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
            style={{ objectPosition: `center ${IMAGE_VERTICAL_ALIGN}` }} 
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sin+Foto' }} 
        />
        {!hasStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-[10px] sm:text-sm font-bold transform -rotate-6 shadow-xl">
                    AGOTADO
                </span>
            </div>
        )}
      </div>
      {/* Padding reducido en móvil (p-2) vs desktop (p-4) */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5 sm:mb-1 truncate">{displayCategory}</p>
          {/* Título más pequeño en móvil y limitado a 2 líneas */}
          <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2 h-9 sm:h-auto">{product.nombre}</h3>
          {product.descripcion && <p className="hidden sm:block text-sm text-gray-500 line-clamp-2">{product.descripcion}</p>} 
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-center justify-between mb-2 sm:mb-0 sm:gap-2">
             <span className="text-base sm:text-xl font-bold text-gray-900 flex-shrink-0">{CURRENCY} {product.precio}</span>
          </div>

          <div className="flex gap-1 sm:gap-2 justify-end mt-1 sm:mt-2">
            <button 
                onClick={handleOpen} 
                className="px-2 py-1.5 sm:px-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1 transition-colors bg-secondary text-white hover:bg-secondary-dark active:scale-95 shadow-secondary flex-1 sm:flex-none"
            >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="sm:inline">Ver</span>
            </button>
            <button 
                onClick={handleOpen} 
                disabled={!hasStock} 
                className={`
                    px-2 py-1.5 sm:px-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-primary flex-1 sm:flex-none
                    ${hasStock ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
            >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> 
                <span className="truncate">{hasStock ? 'Agregar' : 'Sin Stock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;