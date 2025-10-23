import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { salesAPI } from '../services/api';

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar la compra');
      setIsOpen(false);
      return;
    }

    try {
      const saleData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: 'CARD'
      };

      await salesAPI.create(saleData);
      
      alert('¡Compra realizada exitosamente!');
      clearCart();
      setIsOpen(false);
      
      // Recargar la página para actualizar datos
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al procesar la compra');
    }
  };

  return (
    <>
      {/* Icono del carrito */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-300 hover:text-white"
      >
        <ShoppingCart className="w-6 h-6" />
        {getCartItemsCount() > 0 && (
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-gaming-accent">
            {getCartItemsCount()}
          </span>
        )}
      </button>

      {/* Modal del carrito */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Carrito de Compras</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {/* Lista de items */}
                  <div className="mb-6 space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center pb-4 space-x-4 border-b">
                        <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-cover w-full h-full rounded-lg"
                            />
                          ) : (
                            <ShoppingCart className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="font-semibold text-gaming-primary">${item.price}</p>
                          
                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total y acciones */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-gaming-primary">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={handleCheckout}
                        className="w-full py-3 btn-primary"
                      >
                        Proceder al Pago
                      </button>
                      
                      <button
                        onClick={clearCart}
                        className="w-full py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Vaciar Carrito
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartIcon;