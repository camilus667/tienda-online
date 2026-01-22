import React, { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Loader2, ArrowLeft, Star, Heart } from 'lucide-react';
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

    // Safety check for categories to avoid join errors
    const categoryDisplay = Array.isArray(product.categoria)
        ? product.categoria.join(', ')
        : (typeof product.categoria === 'string' ? product.categoria : 'General');

    const displaySubtitle = `${categoryDisplay} Collection`;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col relative overflow-hidden">
            {/* 1. TOP SECTION: IMAGE & FLOATING CONTROLS */}
            <div className="relative h-[60vh] w-full bg-[#E5E0DC] dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 z-40 p-2 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-full text-gray-800 dark:text-white hover:bg-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Bag / Favorite Icons (Top Right) */}
                <div className="absolute top-4 right-4 z-40 flex flex-col gap-3">
                    <button className="p-2 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-full text-gray-800 dark:text-white hover:bg-white transition-colors">
                        <ShoppingBag className="w-6 h-6" />
                        {/* Dot */}
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-2 backdrop-blur-md rounded-full transition-colors ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/50 dark:bg-black/30 text-gray-800 dark:text-white hover:bg-white'}`}
                    >
                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Vertical Quantity Stepper (Mid Right) */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center bg-gray-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 rounded-full py-1 shadow-xl z-30">
                    <button
                        onClick={() => setQuantity(q => q < product.stock ? q + 1 : q)}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:text-gray-300 dark:hover:text-gray-600 transition-colors disabled:opacity-30"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold py-1">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2 hover:text-gray-300 dark:hover:text-gray-600 transition-colors disabled:opacity-30"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                </div>

                {/* Price Tag Pill (Floating on Image) */}
                <div className="absolute bottom-8 left-8 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2 rounded-full shadow-xl transform -rotate-2 z-30">
                    <span className="font-bold text-lg">{CURRENCY} {product.precio}.00</span>
                </div>

                {/* Main Product Image */}
                <img
                    src={product.imagen || "https://placehold.co/400x400?text=No+Image"}
                    alt={product.nombre}
                    className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-95"
                    style={{ objectPosition: `center ${IMAGE_VERTICAL_ALIGN}` }}
                    onClick={() => setIsZoomed(true)}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Sin+Foto' }}
                />
            </div>

            {/* 2. BOTTOM SECTION: DETAILS SHEET */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-[35px] -mt-6 z-20 px-6 py-6 pb-8 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.1)] relative">
                {/* Handle bar for visual cue */}
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>

                {/* Title and Rating Row */}
                <div className="flex justify-between items-start mb-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight max-w-[70%]">
                        {product.nombre}
                    </h1>
                    <div className="flex items-center gap-1 text-orange-400">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">4.8 Rating</span>
                    </div>
                </div>

                {/* Subtitle / Category */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                    {displaySubtitle}
                </p>

                {/* Size Selector */}
                {hasVariants && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">Selecciona Talla</span>
                            <span className="text-xs text-gray-500">Guía de tallas</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.tallas.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`
                                        w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0
                                        ${selectedSize === s
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md scale-110'
                                            : 'border border-gray-300 text-gray-500 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:hover:border-white dark:hover:text-white'}
                                    `}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description (Truncated) */}
                <div className="flex-1 overflow-y-auto mb-6 max-h-[100px] scrollbar-hide">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {product.descripcion || "Diseño exclusivo de alta calidad, perfecto para cualquier ocasión especial. Fabricado con materiales premium para garantizar comodidad y estilo."}
                    </p>
                </div>

                {/* Bottom Action: Price matches title, Buy Button */}
                <div className="mt-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={!hasStock || (hasVariants && !selectedSize)}
                        className={`
                            w-full py-4 rounded-full font-bold text-lg text-white shadow-xl transition-transform active:scale-95
                            ${hasStock
                                ? 'bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                                : 'bg-gray-300 cursor-not-allowed'}
                        `}
                    >
                        {hasStock
                            ? (hasVariants && !selectedSize ? 'Selecciona Talla' : 'Comprar Ahora')
                            : 'Agotado'}
                    </button>
                </div>
            </div>

            {isZoomed && <ImageZoomModal imageUrl={product.imagen} onClose={() => setIsZoomed(false)} />}
        </div>
    );
};

export default ProductDetail;