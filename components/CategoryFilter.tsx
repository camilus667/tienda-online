import React, { useRef, useEffect } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Filtramos "Todos" para que no aparezca en la lista scrolleable, ya que estará fijo
  const scrollableCategories = categories.filter(c => c !== 'Todos');

  useEffect(() => {
    const container = containerRef.current;
    
    // Si seleccionamos "Todos", devolvemos el scroll al principio
    if (selectedCategory === 'Todos' && container) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        return;
    }

    const selectedItem = itemsRef.current.get(selectedCategory);

    if (container && selectedItem) {
      // Calcular la posición para centrar el elemento seleccionado
      const containerWidth = container.clientWidth;
      const itemLeft = selectedItem.offsetLeft;
      const itemWidth = selectedItem.clientWidth;

      // Posición deseada: (Posición del item) - (Mitad de pantalla) + (Mitad del item)
      const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedCategory]);

  return (
    <div className="sticky top-16 z-40 bg-gray-50/95 backdrop-blur-sm py-3 mb-4 -mx-4 shadow-sm border-b border-gray-200/50">
      <div className="flex items-center w-full px-4">
        
        {/* BOTÓN FIJO "TODOS" */}
        <div className="flex-shrink-0 pr-3 border-r border-gray-300 mr-1 z-10 relative">
             <button 
                onClick={() => onSelectCategory('Todos')} 
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap active:scale-95 border
                  ${selectedCategory === 'Todos' 
                    ? 'bg-primary text-white border-primary shadow-primary' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
                `}
              >
                Todos
              </button>
        </div>

        {/* LISTA SCROLLEABLE (Resto de categorías) */}
        <div className="relative flex-1 overflow-hidden">
            <div 
                ref={containerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide w-full touch-pan-x overscroll-x-contain pl-2" 
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
            {scrollableCategories.map(cat => (
                <button 
                key={cat} 
                ref={(el) => {
                    if (el) itemsRef.current.set(cat, el);
                    else itemsRef.current.delete(cat);
                }}
                onClick={() => onSelectCategory(cat)} 
                className={`
                    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap active:scale-95 border
                    ${selectedCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-primary' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
                `}
                >
                {cat}
                </button>
            ))}
            {/* Espaciador final */}
            <div className="w-4 flex-shrink-0"></div>
            </div>

            {/* Indicador visual de scroll (Sombra degradada a la derecha) */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
            
            {/* Sombra pequeña a la izquierda para indicar separación */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
};

export default CategoryFilter;