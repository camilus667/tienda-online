import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Send } from 'lucide-react';
import { CartItem, Product } from '../types';
import { CURRENCY, IMAGE_VERTICAL_ALIGN, STORE_NAME, PHONE_NUMBER } from '../constants';
import { uniqueCartId } from '../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (key: string, delta: number) => void;
  removeFromCart: (key: string) => void;
  changeCartItemSize: (oldKey: string, product: Product, newSize: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen, onClose, cart, updateQuantity, removeFromCart, changeCartItemSize
}) => {
  const cartTotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    let message = `*¡Hola! Mi pedido en ${STORE_NAME} es:*\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre} (Talla: ${item.size}) x${item.quantity} - ${CURRENCY} ${item.precio * item.quantity}\n`;
    });
    message += `\n*Total: ${CURRENCY} ${cartTotal}*`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-800 z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white"><ShoppingCart className="w-5 h-5 text-primary" /> Tu Pedido</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors active:scale-95"><X className="w-6 h-6 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-gray-800 transition-colors">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart size={64} className="opacity-20" />
              <p>Tu carrito está vacío</p>
              <button onClick={onClose} className="text-primary font-semibold hover:underline mt-4 active:scale-95">Ver productos</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.key} className="flex gap-4 bg-white dark:bg-gray-700 p-3 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm transition-colors">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-16 h-16 rounded-lg object-cover object-top bg-gray-100 dark:bg-gray-600 flex-shrink-0"
                  style={{ objectPosition: `center ${IMAGE_VERTICAL_ALIGN}` }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Foto' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.nombre}</h3>
                    <button onClick={() => removeFromCart(item.key)} className="text-gray-400 hover:text-red-500 p-1 active:scale-95"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <p className="text-primary font-bold text-sm mb-1">{CURRENCY} {item.precio * item.quantity}</p>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <select
                      value={item.size}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        if (item.tallas && item.tallas.includes(newSize)) {
                          changeCartItemSize(item.key, item, newSize);
                        }
                      }}
                      className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    >
                      {item.tallas && item.tallas.map(size => <option key={size} value={size}>Talla {size}</option>)}
                    </select>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.key, -1)} className="p-1 rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 active:scale-95"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-medium w-4 text-center dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, 1)} className="p-1 rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 active:scale-95"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 pb-safe transition-colors">
            <div className="flex justify-between items-center mb-4"><span className="text-gray-500 dark:text-gray-400">Total estimado</span><span className="text-2xl font-bold text-gray-900 dark:text-white">{CURRENCY} {cartTotal}</span></div>
            <button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-primary flex items-center justify-center gap-2 transition-transform active:scale-95"><Send className="w-5 h-5" /> Pedir por WhatsApp</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;