import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductosService } from "../api/api.productos";

const ProductoDetailPage = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await ProductosService.getProductoById(id);
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-300">Cargando producto...</p>;
  }

  if (!producto) {
    return <p className="text-center text-red-500">Producto no encontrado</p>;
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imagen del producto */}
        <div className="flex justify-center items-center">
          <img
            src={producto.imagen || "https://via.placeholder.com/300"}
            alt={producto.nombre}
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
        {/* Detalles del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
          <p className="text-xl text-blue-400 mb-4">{`$${producto.precio}`}</p>
          <p className="text-gray-300 mb-6">{producto.descripcion}</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetailPage;
