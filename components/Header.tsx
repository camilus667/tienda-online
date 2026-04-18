import React from 'react';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STORE_NAME, LOGO_URL } from '../constants';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onReload: () => void;
  theme: string;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onReload, theme, onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // Si estamos en home, recargar/actualizar productos
      onReload();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Si estamos en pagina interna, volver al home
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-100 dark:border-gray-700 h-16 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-full flex justify-between items-center relative">

        {/* Lado Izquierdo: Logo */}
        <div
          className="flex items-center gap-2 z-20 cursor-pointer relative active:scale-95 transition-transform"
          onClick={handleLogoClick}
          title={location.pathname === '/' ? "Recargar tienda" : "Volver al inicio"}
        >
          {LOGO_URL && (
            <img
              src={LOGO_URL}
              alt="Logo"
              className="max-h-10 w-auto object-contain rounded-lg dark:brightness-90"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
        </div>

        {/* Centro Absoluto: Título */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h1
            className="text-xl sm:text-2xl font-semibold tracking-tight title-font cursor-pointer pointer-events-auto text-center px-2 select-none dark:text-white"
            onClick={handleLogoClick}
          >
            {STORE_NAME}
          </h1>
        </div>

        {/* Lado Derecho: Carrito y Theme Toggle */}
        <div className="flex items-center gap-2 z-20 relative">
          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors active:scale-95"
            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </button>

          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors active:scale-95"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-gray-800 animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;