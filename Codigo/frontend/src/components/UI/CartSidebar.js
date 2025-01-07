import React from "react";
import { useCart } from "../../context/CartContext";
import { FaTimes, FaTrash } from "react-icons/fa";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, calculateTotal, clearCart } = useCart();

  const handleRedirectToCartPage = () => {
    if (cartItems.length > 0) {
      window.location.href = "/carrito"; // Redirigir a la página del carrito
    }
  };
  
  // Manejar clic fuera del carrito para cerrarlo
  const handleOverlayClick = (event) => {
    if (event.target.id === "cart-overlay") {
      onClose(); // Llama a la función pasada desde el Header
    }
  };


  return (
    <>
      {/* Overlay para cerrar el carrito al hacer clic fuera */}
      {isOpen && (
        <div
          id="cart-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Menú lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-800 text-gray-100 shadow-lg z-50 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        {/* Header del Carrito */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Tu Carrito</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Productos en el Carrito */}
        <div className="p-4 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400">Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-700 rounded-md mb-3"
              >
                <div>
                  <h3 className="text-sm font-bold">{item.nombre}</h3>
                  <p className="text-sm text-gray-400">{`$${item.precio}`}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Acciones del Carrito */}
        <div className="p-4 border-t border-gray-700">
          {cartItems.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Total:</span>
                <span className="text-lg font-bold">{`$${calculateTotal()}`}</span>
              </div>
              <button
                onClick={handleRedirectToCartPage}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Realizar Compra
              </button>
              <button
                onClick={clearCart}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Vaciar Carrito
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
