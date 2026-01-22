import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Maximize, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { CURRENCY, IMAGE_ASPECT_RATIO, IMAGE_VERTICAL_ALIGN } from '../constants';
import ImageZoomModal from './ImageZoomModal';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product, size: string, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const hasVariants = product?.tallas && Array.isArray(product.tallas) && product.tallas.length > 0;
    const hasStock = product ? product.stock > 0 : false;

    useEffect(() => {
        setQuantity(1);
        if (product && hasVariants) {
            setSelectedSize(product.tallas[0]);
        } else {
            setSelectedSize(null);
        }
    }, [product, hasVariants]);

    if (!product) return null;

    const size = hasVariants && selectedSize
        ? selectedSize
        : (product.tallas && product.tallas.length > 0 ? product.tallas[0] : 'Única');

    const handleAddToCart = () => {
        if (!hasStock) return;
        if (hasVariants && !selectedSize) return;
        onAddToCart(product, size, quantity);
    };

    const productCategories = product.categoria.join(', ');
    const catColorTags = [productCategories ? productCategories.split(',')[0].trim() : null, product.color].filter(Boolean);

    return (
        <>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg sm:max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col transform transition-transform duration-300 scale-100 transition-colors">
                    <div className="px-4 py-2 sm:p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{product.nombre}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors active:scale-95">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-full transition-colors">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-4">
                            {/* COLUMNA 1: IMAGEN Y DATOS PRINCIPALES */}
                            <div className='sm:col-span-1'>
                                <div className={`relative ${IMAGE_ASPECT_RATIO} mb-2 sm:mb-4 group`}>
                                    <img
                                        src={product.imagen || "https://placehold.co/400x400?text=No+Image"}
                                        alt={product.nombre}
                                        className="w-full h-full object-cover rounded-xl shadow-md cursor-pointer dark:brightness-90 transition-all"
                                        style={{ objectPosition: `center ${IMAGE_VERTICAL_ALIGN}` }}
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sin+Foto' }}
                                        onClick={() => setIsZoomed(true)}
                                    />
                                    {/* Tags solo en móvil */}
                                    <div className='absolute bottom-2 right-2 flex gap-1 sm:hidden'>
                                        {catColorTags.map(tag => (
                                            <span key={tag} className="bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">{tag}</span>
                                        ))}
                                    </div>
                                    {/* Overlay Lupa en Desktop */}
                                    <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center rounded-xl cursor-pointer" onClick={() => setIsZoomed(true)}>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg"><ZoomIn className="w-6 h-6 text-gray-700 dark:text-gray-300" /></div>
                                    </div>
                                    <button onClick={() => setIsZoomed(true)} className='sm:hidden absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full shadow-lg' title='Ver en pantalla completa'><Maximize className='w-5 h-5' /></button>
                                </div>
                                <div className='mt-2 sm:mt-4'>
                                    <p className="text-3xl font-extrabold text-primary mb-2 transition-colors">{CURRENCY} {product.precio}</p>
                                    <div className="hidden sm:flex flex-wrap gap-2 text-xs mb-3">
                                        {productCategories && <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">Cat: {productCategories}</span>}
                                        {product.color && <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">Color: {product.color}</span>}
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNA 2: DESCRIPCIÓN Y COMPRA */}
                            <div className='flex flex-col justify-start sm:col-span-1'>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:mt-0">Detalles:</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{product.descripcion || "Sin descripción."}</p>
                                    <div className='py-2 my-1 border-t border-b border-gray-100 dark:border-gray-700 sm:py-3 sm:my-3'>
                                        {hasVariants && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">Talla:</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.tallas.map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => setSelectedSize(s)}
                                                            className={`
                                                    px-3 py-1 rounded-full border-2 text-sm font-medium transition-all active:scale-95 
                                                    ${selectedSize === s ? 'bg-primary border-primary text-white shadow-md' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary dark:hover:border-primary'}
                                                `}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">Cantidad:</label>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-1">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 active:scale-95 transition-colors"><Minus className="w-4 h-4" /></button>
                                                    <span className="text-base font-bold w-4 text-center dark:text-white">{quantity}</span>
                                                    <button onClick={() => setQuantity(q => q < product.stock ? q + 1 : q)} disabled={quantity >= product.stock} className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50 active:scale-95 transition-colors"><Plus className="w-4 h-4" /></button>
                                                </div>
                                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:mt-1 ml-auto sm:ml-0">
                                                    {hasStock ? <span className="text-primary transition-colors">En stock: {product.stock} unid.</span> : <span className="text-red-600">Agotado</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 transition-colors">
                        <button
                            onClick={handleAddToCart}
                            disabled={!hasStock || (hasVariants && !selectedSize)}
                            className={`
                    w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform shadow-primary 
                    ${hasStock && (!hasVariants || selectedSize) ? 'bg-primary text-white hover:bg-primary-dark shadow-primary' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                `}
                        >
                            <ShoppingCart className="w-5 h-5" /> {hasStock ? (hasVariants && !selectedSize ? 'Selecciona Talla' : `Añadir (${quantity})`) : 'Sin Stock'}
                        </button>
                    </div>
                </div>
            </div>
            {isZoomed && <ImageZoomModal imageUrl={product.imagen} onClose={() => setIsZoomed(false)} />}
        </>
    );
};

export default ProductModal;
```