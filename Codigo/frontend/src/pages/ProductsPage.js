import React, { useEffect, useState } from "react";
import { ProductosService } from "../api/api.productos";
import { CategoriasService } from "../api/api.categorias";
import { toast } from "react-toastify"; // Para mostrar notificaciones
import { useCart } from "../context/CartContext"; // Contexto del carrito

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Cantidad de productos por página

  const { addToCart } = useCart();

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          ProductosService.getProductos(),
          CategoriasService.getCategorias(),
        ]);
        setProductos(productosData.productos || []);
        setCategorias(categoriasData || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar productos o categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar el filtro por categoría
  const handleCategoriaSeleccionada = async (idCategoria) => {
    setCategoriaSeleccionada(idCategoria);
    setLoading(true);
    try {
      const productosFiltrados = idCategoria
        ? await ProductosService.getProductosPorCategoria(idCategoria)
        : await ProductosService.getProductos();

      setProductos(productosFiltrados.productos || []);
    } catch (error) {
      console.error("Error al filtrar por categoría:", error);
      toast.error("Error al filtrar productos por categoría.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar el filtro por rango de precios
  const handleFiltrarPorPrecio = async () => {
    setLoading(true);
    try {
      const productosFiltrados = await ProductosService.getProductosFiltradosPorPrecio(
        precioMin,
        precioMax
      );
      setProductos(productosFiltrados.productos || []);
    } catch (error) {
      console.error("Error al filtrar por precio:", error);
      toast.error("Error al filtrar productos por precio.");
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    try {
      addToCart(producto);
      toast.success(`${producto.nombre} agregado al carrito.`);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      toast.error("Error al agregar producto al carrito.");
    }
  };

  // Lógica de paginación
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  const paginatedProductos = productos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

    // Función para manejar stock dinámico
    const renderStockStatus = (stock) => {
      if (stock > 10) return <p className="text-green-500">En stock</p>;
      if (stock > 0) return <p className="text-yellow-500">Quedan {stock} unidades</p>;
      return <p className="text-red-500">Agotado</p>;
    };

    
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Menú lateral */}
      <aside className="w-1/4 bg-gray-800 p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <ul>
          <li
            className={`cursor-pointer py-2 px-4 ${
              !categoriaSeleccionada
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleCategoriaSeleccionada(null)}
          >
            Todas las Categorías
          </li>
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className={`cursor-pointer py-2 px-4 ${
                categoriaSeleccionada === categoria.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => handleCategoriaSeleccionada(categoria.id)}
            >
              {categoria.nombre}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-bold mt-6 mb-4">Rango de Precios</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="number"
            placeholder="Precio Mínimo"
            className="p-2 rounded bg-gray-700 text-gray-100"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio Máximo"
            className="p-2 rounded bg-gray-700 text-gray-100"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
          />
          <button
            onClick={handleFiltrarPorPrecio}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Filtrar
          </button>
        </div>
      </aside>

      {/* Listado de productos */}
      <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProductos.map((producto) => (
              <div
                key={producto.id}
                className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
              >
                <img
                  src={producto.imagen || "https://via.placeholder.com/150"}
                  alt={producto.nombre}
                  className="w-full h-48 rounded-md mb-4"
                />
                <h2 className="font-bold text-lg text-center">
                  <a
                    href={`/productos/${producto.id}`}
                    className="hover:text-blue-400 no-underline"
                  >
                    {producto.nombre}
                  </a>
                </h2>
                {producto.promocion && (
                  <p className="text-red-400 text-center mb-2">
                    Promoción: {producto.promocion.nombre}
                  </p>
                )}
                <p className="font-bold text-blue-400 mb-4 text-center">{`$${producto.precio}`}</p>
                {renderStockStatus(producto.stock)}
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center w-full"
                >
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Controles de paginación */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 bg-gray-800 text-white rounded">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductosPage;
