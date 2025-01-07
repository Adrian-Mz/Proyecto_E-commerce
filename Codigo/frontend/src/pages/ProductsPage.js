import React, { useEffect, useState } from 'react';
import { ProductosService } from '../api/api.productos';
import { CategoriasService } from '../api/api.categorias';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          ProductosService.getProductos(),
          CategoriasService.getCategorias(),
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
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
      setProductos(productosFiltrados);
    } catch (error) {
      console.error('Error al filtrar por categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar el filtro por rango de precios
  const handleFiltrarPorPrecio = async () => {
    setLoading(true);
    try {
      const productosFiltrados = await ProductosService.getProductosFiltradosPorPrecio(precioMin, precioMax);
      setProductos(productosFiltrados);
    } catch (error) {
      console.error('Error al filtrar por precio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Menú lateral */}
      <aside className="w-1/4 bg-gray-800 p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <ul>
          <li
            className={`cursor-pointer py-2 px-4 ${
              !categoriaSeleccionada ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleCategoriaSeleccionada(null)}
          >
            Todas las Categorías
          </li>
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className={`cursor-pointer py-2 px-4 ${
                categoriaSeleccionada === categoria.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
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
          <div className="flex flex-col space-y-4">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="flex items-center p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={producto.imagen || 'https://via.placeholder.com/150'}
                  alt={producto.nombre}
                  className="w-24 h-24 rounded-md object-cover mr-4"
                />
                <div>
                  <h2 className="font-bold text-lg">
                    <a href={`/productos/${producto.id}`} className="hover:text-blue-400">
                        {producto.nombre}
                    </a>
                  </h2>
                  <p className="text-gray-400">{producto.descripcion}</p>
                  <p className="font-bold text-blue-400">{`$${producto.precio}`}</p>
                </div>
                {/* Botón Agregar al Carrito */}
                <div className="col-span-2 flex justify-end">
                    <button
                        className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => alert('Producto agregado al carrito!')}
                    >
                        <span className="mr-2">Agregar al Carrito</span>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l3.4-6H6.4M7 13l-1.2 2M7 13l1.6-3M17 13l1.2 2M17 13l-1.6-3M5 21a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
                        />
                        </svg>
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductosPage;
