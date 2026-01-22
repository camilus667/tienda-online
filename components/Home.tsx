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
}

const Home: React.FC<HomeProps> = ({
  products,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onReload
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
      if (selectedCategory !== "Todos") {
        matchesCategory = product.categoria.includes(selectedCategory);
      }
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-6 transition-colors duration-300">
      {/* Search Bar */}
      <div className="pt-2 pb-2 space-y-3 bg-gray-50 dark:bg-gray-900 sticky top-16 z-30 transition-colors">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 ring-primary bg-white dark:bg-gray-800 dark:text-white shadow-sm transition-colors"
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
            disabled={loading}
            className={`hidden sm:flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm transition-colors active:scale-95 shadow-primary ${loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
            title="Actualizar catálogo"
          >
            {loading ? (<Loader2 className="w-5 h-5 animate-spin" />) : (<RefreshCw className="w-5 h-5" />)}
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
            <ProductCard key={product.id} product={product} />
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