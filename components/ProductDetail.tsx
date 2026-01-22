import React, { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Loader2, ArrowLeft, Star, Heart, Maximize2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { CURRENCY, IMAGE_ASPECT_RATIO, IMAGE_VERTICAL_ALIGN } from '../constants';
import { createSlug } from '../utils/helpers';
import ImageZoomModal from './ImageZoomModal';

interface ProductDetailProps {
    products: Product[];
    onAddToCart: (product: Product, size: string, quantity: number) => void;
    loading: boolean;
    favorites: string[];
    toggleFavorite: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, onAddToCart, loading, favorites, toggleFavorite }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const product = products.find(p => createSlug(p.nombre) === slug);

    const hasVariants = product?.tallas && Array.isArray(product.tallas) && product.tallas.length > 0;
    const hasStock = product ? product.stock > 0 : false;
    const isFavorite = product ? favorites.includes(product.id) : false;

    useEffect(() => {
        setQuantity(1);
        if (product && hasVariants) {
            setSelectedSize(product.tallas[0]);
        } else {
            setSelectedSize(null);
        }
    }, [product, hasVariants]);

    if (loading && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
                <p className="text-gray-500 text-lg">Producto no encontrado</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    const size = hasVariants && selectedSize
        ? selectedSize
        : (product.tallas && product.tallas.length > 0 ? product.tallas[0] : 'U');

    const handleAddToCart = () => {
        if (!hasStock) return;
        if (hasVariants && !selectedSize) return;
        onAddToCart(product, size, quantity);
        navigate('/');
    };

    const handleBack = () => navigate('/');

    const categoryDisplay = Array.isArray(product.categoria)
        ? product.categoria.join(', ')
        : (typeof product.categoria === 'string' ? product.categoria : 'General');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col relative overflow-hidden">
            {/* BACK BUTTON - Fixed below header */}
            <button
                onClick={handleBack}
                className="fixed top-[72px] left-4 z-50 p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-gray-900 dark:text-white shadow-md active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            {/* 1. TOP SECTION: IMAGE & FLOATING CONTROLS - TALLER HEIGHT (55vh) */}
            <div className="relative h-[55vh] w-full bg-[#E5E0DC] dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-300">
                {/* Right Icons - Adjusted top position to match roughly below header */}
                <div className="absolute top-[72px] right-4 z-50 flex flex-col gap-3">
                    <button className="p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-gray-900 dark:text-white shadow-sm active:scale-95 transition-all">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-2.5 backdrop-blur-md rounded-full shadow-sm active:scale-95 transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white'}`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Zoom Button */}
                <button
                    onClick={() => setIsZoomed(true)}
                    className="absolute bottom-6 right-4 z-30 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm active:scale-95"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>

                {/* Vertical Quantity Stepper */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center bg-gray-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 rounded-full py-1 shadow-xl z-30">
                    <button
                        onClick={() => setQuantity(q => q < product.stock ? q + 1 : q)}
                        disabled={quantity >= product.stock}
                        className="p-1.5 hover:text-gray-300 dark:hover:text-gray-600 transition-colors disabled:opacity-30"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold py-0.5">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-1.5 hover:text-gray-300 dark:hover:text-gray-600 transition-colors disabled:opacity-30"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-6 left-6 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2 rounded-full shadow-xl transform -rotate-2 z-30">
                    <span className="font-bold text-lg">{CURRENCY} {product.precio}.00</span>
                </div>

                <img
                    src={product.imagen || "https://placehold.co/400x400?text=No+Image"}
                    alt={product.nombre}
                    className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-95"
                    style={{ objectPosition: `center ${IMAGE_VERTICAL_ALIGN}` }}
                    onClick={() => setIsZoomed(true)}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sin+Foto' }}
                />
            </div>

            {/* 2. BOTTOM SECTION: DETAILS SHEET - Flowing Content mode */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-[35px] -mt-8 z-20 px-6 pt-6 pb-6 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.1)] relative overflow-y-auto">
                {/* Handle */}
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 flex-shrink-0"></div>

                <div className="space-y-4 pb-20 sm:pb-4">
                    {/* Header: Title & Rating */}
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight max-w-[70%]">
                            {product.nombre}
                        </h1>
                        <div className="flex items-center gap-1 text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">4.8</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {product.descripcion || "Diseño exclusivo de alta calidad. Materiales premium para garantizar comodidad y estilo en cada momento."}
                        </p>
                    </div>

                    {/* Size Selector */}
                    {hasVariants && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Selecciona Talla</span>
                                <span className="text-xs text-gray-500 underline">Guía de tallas</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.tallas.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`
                                            w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                            ${selectedSize === s
                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md scale-105'
                                                : 'border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:hover:border-white dark:hover:text-white'}
                                        `}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Collection Tag */}
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                            {categoryDisplay} Collection
                        </p>
                    </div>

                    {/* Add to Cart Button - Flows naturally after content */}
                    <div className="pt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!hasStock || (hasVariants && !selectedSize)}
                            className={`
                                w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2
                                ${hasStock
                                    ? 'bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                                    : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            {hasStock
                                ? (hasVariants && !selectedSize ? 'Elige tu Talla' : 'Añadir al Carrito')
                                : 'Agotado'}
                        </button>
                    </div>
                </div>
            </div>

            {isZoomed && <ImageZoomModal imageUrl={product.imagen} onClose={() => setIsZoomed(false)} />}
        </div>
    );
};

export default ProductDetail;