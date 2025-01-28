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

  useEffect(() => {
    const syncCart = async () => {
      if (userId) {
        try {
          const carrito = await CarritoService.obtenerCarrito(userId);
  
          const productosConPromocion = carrito.productos.map((item) => ({
            ...item,
            precio_unitario: parseFloat(item.precio_unitario), // Convertir el precio
            mensajePromocion: item.mensajePromocion || null, // Mensaje de promoción
            nombrePromocion: item.producto?.promocion?.nombre || "No aplica promoción", // Nombre de la promoción
          }));
  
          setCartItems(productosConPromocion); // Actualizar el carrito con promociones
        } catch (error) {
          console.error("Error al sincronizar el carrito:", error);
        }
      } else {
        setCartItems([]);
      }
    };
  
    syncCart();
  }, [userId]);

  const addToCart = async (producto) => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user && user.id) {
      try {
        const carritoActualizado = await CarritoService.agregarProducto(
          user.id,
          producto.id,
          1 // Cantidad predeterminada
        );
  
        const productosActualizados = carritoActualizado.productos.map((item) => ({
          ...item,
          precio_unitario: parseFloat(item.precio_unitario), // Formato del precio
          mensajePromocion: item.mensajePromocion || null,// Mensaje promocional
          nombrePromocion: item.producto?.promocion?.nombre 
        }));
  
        setCartItems(productosActualizados); // Actualizar el estado del carrito
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