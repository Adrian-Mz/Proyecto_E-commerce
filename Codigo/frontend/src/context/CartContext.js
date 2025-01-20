import React, { createContext, useState, useContext, useEffect } from "react";
import { CarritoService } from "../api/api.carrito";
import { toast } from "react-toastify";

// Crear el contexto del carrito
const CartContext = createContext();

// Proveedor del carrito
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(() => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser)?.id || null : null;
  });

  // Sincronizar carrito con el backend al iniciar sesión
  useEffect(() => {
    const syncCart = async () => {
      if (userId) {
        try {
          const carrito = await CarritoService.obtenerCarrito(userId);
          setCartItems(carrito.productos || []);
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      } else {
        setCartItems([]); // Vacía el carrito si no hay usuario
      }
    };

    syncCart();
  }, [userId]);

  // Función para agregar productos al carrito
  const addToCart = async (producto) => {
    const user = JSON.parse(localStorage.getItem("usuario")); // Obtener el usuario actual
    if (user && user.id) {
      try {
        // Llamada al backend para agregar el producto
        const carritoActualizado = await CarritoService.agregarProducto(
          user.id,
          producto.id,
          1 // Cantidad predeterminada
        );
        // Actualizar el estado del carrito
        setCartItems(carritoActualizado.productos || []);
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
      }
    } else {
      console.error("Usuario no autenticado. No se puede agregar al carrito.");
    }
  };
  

  // Función para eliminar un producto específico del carrito
  const removeFromCart = async (productoId) => {
    try {
      if (userId) {
        // Llama al servicio para eliminar el producto del carrito en el backend
        await CarritoService.eliminarProducto(userId, productoId);
  
        // Actualiza el carrito local después de la eliminación
        setCartItems((prevCart) => prevCart.filter((item) => item.productoId !== productoId));
      } else {
        // Para usuarios no logueados, simplemente actualiza el estado local
        setCartItems((prevCart) => prevCart.filter((item) => item.id !== productoId));
      }
  
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      toast.error("No se pudo eliminar el producto del carrito.");
    }
  };

  // Función para vaciar el carrito
  const clearCart = async () => {
    if (!userId) {
      console.error("No hay usuario logueado.");
      return;
    }

    try {
      const carritoVaciado = await CarritoService.vaciarCarrito(userId);
      setCartItems(carritoVaciado.productos || []);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  };

  // Cambiar de usuario
  const changeUser = (newUserId) => {
    setUserId(newUserId);
  };

  // Cálculo del total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0).toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        calculateTotal,
        changeUser,
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