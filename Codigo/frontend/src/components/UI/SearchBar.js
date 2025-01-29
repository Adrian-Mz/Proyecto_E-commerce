import React, { useState, useEffect } from "react";
import { ProductosService } from "../../api/api.productos";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [productosSimilares, setProductosSimilares] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        try {
          const productos = await ProductosService.buscarProductos(query, 5);
          setSuggestions(productos);
          setShowSuggestions(true);

          // Si encuentra productos, busca similares del primero
          if (productos.length > 0) {
            const { id, categoriaId, marca } = productos[0];
            const similares = await ProductosService.getProductosSimilares(id, categoriaId, marca);
            setProductosSimilares(similares);
          }
        } catch (error) {
          console.error("Error en autocompletado:", error);
        }
      } else {
        setShowSuggestions(false);
        setProductosSimilares([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-72">
      <input
        type="text"
        placeholder="¿Qué estás buscando?"
        className="w-full p-2 rounded-md border text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <FaSearch className="absolute right-3 top-3 text-gray-500" />

      {/* 📌 Lista de sugerencias */}
      {showSuggestions && (
        <ul className="absolute z-10 bg-white border border-gray-200 w-full rounded-lg shadow-lg mt-1 text-sm">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((producto) => (
                <li
                  key={producto.id}
                  className="p-2 hover:bg-blue-100 cursor-pointer text-gray-800 transition-colors duration-200"
                  onClick={() => {
                    window.location.href = `/productos/${producto.id}`;
                  }}
                >
                  {producto.nombre}
                </li>
              ))}
              <li className="p-2 font-bold text-gray-600 border-t border-gray-300">Productos similares</li>
            </>
          ) : (
            <li className="p-2 text-gray-500">No hay resultados</li>
          )}

          {productosSimilares.length > 0 &&
            productosSimilares.map((producto) => (
              <li
                key={producto.id}
                className="p-2 hover:bg-blue-100 cursor-pointer text-gray-700 transition-colors duration-200"
                onClick={() => {
                  window.location.href = `/productos/${producto.id}`;
                }}
              >
                {producto.nombre}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
