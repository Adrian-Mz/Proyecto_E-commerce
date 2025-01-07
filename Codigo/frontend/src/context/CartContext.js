import React, { createContext, useState, useContext, useEffect } from "react";

// Crear el contexto del carrito
const CartContext = createContext();

// Proveedor del carrito
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Actualizar localStorage cada vez que cambien los productos del carrito
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para agregar productos al carrito
  const addToCart = (producto) => {
    setCartItems((prevCart) => [...prevCart, producto]);
  };

  // Función para eliminar un producto específico del carrito
  const removeFromCart = (productoId) => {
    setCartItems((prevCart) =>
      prevCart.filter((item) => item.id !== productoId)
    );
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Función para obtener todos los elementos del carrito
  const getCartItems = () => cartItems;

  // Cálculo del total del carrito
  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.precio || 0), 0)
      .toFixed(2); // Asegúrate de que siempre devuelve un número válido
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartItems,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto del carrito
export const useCart = () => {
  return useContext(CartContext);
};
