import React, { useMemo } from 'react';
import { Search, Loader2, RefreshCw, X } from 'lucide-react';
import { Product } from '../types';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';

interface HomeProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onReload: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

const Home: React.FC<HomeProps> = ({
  products,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onReload,
  favorites,
  toggleFavorite,
  onAddToCart
}) => {
  const categories = useMemo(() => {
    const uniqueCats = new Set<string>();
    products.forEach(p => {
      if (Array.isArray(p.categoria)) {
        p.categoria.forEach(c => { if (c) uniqueCats.add(c.trim()); });
      }
    });
    return ["Todos", ...Array.from(uniqueCats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesCategory = selectedCategory === "Todos";

      if (selectedCategory === "Favoritos") {
        matchesCategory = favorites.includes(product.id);
      } else if (selectedCategory !== "Todos") {
        matchesCategory = product.categoria.includes(selectedCategory);
      }

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory, favorites]);

  return (
    <main className="max-w-6xl mx-auto px-4 pb-20 transition-colors duration-300">
      {/* Search Bar */}
      {/* Compact Banner */}
      <div className="pt-20 px-1 mb-2">
        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-xl p-4 shadow-md flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold leading-tight">Mundo Kids</h1>
            <p className="text-[10px] text-gray-300 font-medium">Estilo y calidad para tus peques</p>
          </div>
          <div className="bg-white/20 p-1.5 rounded-full">
            <span className="text-xl">✨</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="py-2 space-y-3 bg-gray-50 dark:bg-gray-900 sticky top-16 z-30 transition-colors">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white border-2 border-transparent focus:border-primary/20 shadow-sm text-sm font-medium transition-all placeholder:text-gray-500 focus:ring-0 focus:bg-white dark:focus:bg-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full active:scale-95">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={onReload}
            className="p-3.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full shadow-md active:scale-95 transition-transform"
            title="Actualizar / Filtros"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-2 text-primary" />
          <p>Cargando catálogo...</p>
        </div>
      )}

      {error && (
        <div className="bg-orange-50 text-orange-800 p-4 rounded-xl mb-6 border border-orange-200 text-sm">
          Error al cargar datos. Mostrando datos de ejemplo.
        </div>
      )}

      {!loading && (
        // CAMBIO PRINCIPAL: grid-cols-2 por defecto, gap reducido en móvil (gap-3)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500"><p>No se encontraron productos.</p></div>
      )}
    </main>
  );
};

export default Home;