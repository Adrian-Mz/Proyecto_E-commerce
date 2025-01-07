import React from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, calculateTotal } = useCart();

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4 p-4 bg-gray-800 rounded-md"
            >
              <div>
                <h2 className="font-bold">{item.nombre}</h2>
                <p>{`$${item.precio}`}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
          <div className="mt-6">
            <h3 className="text-lg font-bold">Total: ${calculateTotal()}</h3>
            <button
              onClick={clearCart}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Vaciar Carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
