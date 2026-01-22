import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Product, CartItem } from './types';
import { fetchProducts } from './services/productService';
import { uniqueCartId, hexToRgba } from './utils/helpers';
import { PRIMARY_COLOR_HEX, SECONDARY_COLOR_HEX, TITLE_FONT_FAMILY, TITLE_COLOR_HEX } from './constants';

import Header from './components/Header';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import BottomNav from './components/BottomNav';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [error, setError] = useState<string | null>(null);
  const [productsVersion, setProductsVersion] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, productsVersion]);

  const forceReload = () => {
    setProductsVersion(prev => prev + 1);
  };

  const addToCart = useCallback((product: Product, size: string, quantity: number) => {
    const key = uniqueCartId(product.id, size);
    setCart(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, key: key, size: size, quantity: quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((key: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.key === key) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  }, []);

  const changeCartItemSize = useCallback((oldKey: string, product: Product, newSize: string) => {
    const newKey = uniqueCartId(product.id, newSize);
    setCart(prevCart => {
      const currentItem = prevCart.find(item => item.key === oldKey);
      if (!currentItem) return prevCart;
      const itemWithNewSize = prevCart.find(item => item.key === newKey);
      if (itemWithNewSize && newKey !== oldKey) {
        return prevCart
          .filter(item => item.key !== oldKey)
          .map(item => item.key === newKey ? { ...item, quantity: item.quantity + currentItem.quantity } : item);
      }
      return prevCart.map(item => item.key === oldKey ? { ...item, key: newKey, size: newSize } : item);
    });
  }, []);

  const removeFromCart = useCallback((key: string) => setCart(prev => prev.filter(item => item.key !== key)), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const primaryRgbaShadow = hexToRgba(PRIMARY_COLOR_HEX, 0.3);
  const secondaryRgbaShadow = hexToRgba(SECONDARY_COLOR_HEX, 0.3);

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative w-full">
        {/* Dynamic Styles Injection */}
        <style>
          {`
              :root {
                  --primary-color: ${PRIMARY_COLOR_HEX};
                  --primary-shadow: ${primaryRgbaShadow};
                  --secondary-color: ${SECONDARY_COLOR_HEX};
                  --secondary-shadow: ${secondaryRgbaShadow};
                  --title-font: '${TITLE_FONT_FAMILY}', sans-serif;
                  --title-color: ${TITLE_COLOR_HEX};
              }
              .bg-primary { background-color: var(--primary-color); }
              .hover\\:bg-primary-dark:hover { background-color: color-mix(in srgb, var(--primary-color) 85%, black); }
              .text-primary { color: var(--primary-color); }
              .border-primary { border-color: var(--primary-color); }
              .ring-primary { --tw-ring-color: var(--primary-color); }
              .shadow-primary { box-shadow: 0 4px 6px -1px var(--primary-shadow), 0 2px 4px -2px var(--primary-shadow); }
              
              .bg-secondary { background-color: var(--secondary-color); }
              .hover\\:bg-secondary-dark:hover { background-color: color-mix(in srgb, var(--secondary-color) 85%, black); }
              .shadow-secondary { box-shadow: 0 4px 6px -1px var(--secondary-shadow), 0 2px 4px -2px var(--secondary-shadow); }
              .title-font { font-family: var(--title-font); color: var(--title-color); }

              /* Dark mode specific backgrounds if needed */
              .dark .bg-gray-50 { background-color: #111827; }
              .dark .bg-white { background-color: #1f2937; }
              .dark .text-gray-800 { color: #f3f4f6; }
              .dark .text-gray-600 { color: #d1d5db; }
              `}
        </style>

        <Header
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          onReload={forceReload}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="pb-24"> {/* Padding bottom para el BottomNav */}
          <Routes>
            <Route path="/" element={
              <Home
                products={products}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onReload={forceReload}
              />
            } />
            <Route path="/producto/:slug" element={
              <ProductDetail
                products={products}
                loading={loading}
                onAddToCart={addToCart}
              />
            } />
          </Routes>
        </div>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          changeCartItemSize={changeCartItemSize}
        />

        <BottomNav cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      </div>
    </HashRouter>
  );
}