import React, { useEffect, useState } from 'react';
import { Home, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
    cartCount: number;
    onCartClick: () => void;
    favoritesCount: number;
    onFavoritesClick: () => void;
    onHomeClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ cartCount, onCartClick, favoritesCount, onFavoritesClick, onHomeClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navItems = [
        { icon: Home, label: 'Home', path: '/', action: () => {
            onHomeClick();
            if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
            else navigate('/');
        }},
        { icon: Heart, label: 'Favoritos', path: '/favoritos', action: onFavoritesClick, isFav: true },
        { icon: ShoppingBag, label: 'Carrito', path: '', action: onCartClick, isCart: true },
    ];

    return (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] border border-gray-200 dark:border-gray-700 flex items-center gap-8 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
                {navItems.map((item, index) => {
                    const isActive = item.path === location.pathname && !item.isCart;
                    const Icon = item.icon;

                    return (
                        <button
                            key={index}
                            onClick={item.action}
                            className={`relative flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-primary dark:text-white scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <Icon className={`${isActive ? 'fill-current' : ''} w-6 h-6 stroke-[2px]`} />
                            {item.isCart && cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                                    {cartCount}
                                </span>
                            )}
                            {item.isFav && favoritesCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                                    {favoritesCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
