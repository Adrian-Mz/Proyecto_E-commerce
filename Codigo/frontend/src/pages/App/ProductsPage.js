import React, { useEffect, useState } from "react";
import { ProductosService } from "../../api/api.productos";
import { CategoriasService } from "../../api/api.categorias";
import { toast } from "react-toastify"; // Para mostrar notificaciones
import { useCart } from "../../context/CartContext"; // Contexto del carrito
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CButton,
} from "@coreui/react";
import { FaHandPointUp, FaShoppingCart } from "react-icons/fa";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
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

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Menú lateral */}
      <aside className="w-1/4 bg-gray-200 p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <ul>
          <li
            className={`cursor-pointer py-2 px-4 ${
              !categoriaSeleccionada
                ? "bg-gray-300 text-gray-900"
                : "text-gray-600 hover:bg-gray-300"
            } hover:scale-105 transition-transform duration-200 ease-in-out`}
            onClick={() => handleCategoriaSeleccionada(null)}
          >
            Todas las Categorías
          </li>
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className={`cursor-pointer py-2 px-4 ${
                categoriaSeleccionada === categoria.id
                  ? "bg-gray-300 text-gray-900"
                  : "text-gray-600 hover:bg-gray-300"
              } hover:scale-105 transition-transform duration-200 ease-in-out`}
              onClick={() => handleCategoriaSeleccionada(categoria.id)}
            >
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </aside>

      {/* Listado de productos */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }} lg={{ cols: 3 }}>
            {paginatedProductos.map((producto) => (
              <CCol xs key={producto.id}>
                <CCard
                  className="hover:shadow-xl transition-transform transform hover:scale-105"
                  style={{ borderColor: "#e2e8f0", backgroundColor: "#f9fafb" }}
                >
                  <CCardImage
                    orientation="top"
                    src={producto.imagen || "https://via.placeholder.com/150"}
                  />
                  <CCardBody>
                    <CCardTitle className="font-bold">{producto.nombre}</CCardTitle>
                    {producto.promocion && producto.promocion.descuento > 0 ? (
                      // Caso cuando el producto tiene una promoción válida (descuento > 0)
                      <>
                        {/* Precio original tachado */}
                        <CCardText className="text-sm text-gray-500 line-through">
                          ${producto.precio}
                        </CCardText>
                        {/* Porcentaje de descuento */}
                        <CCardText className="text-red-600 font-semibold text-sm">
                          {producto.promocion.descuento}% de descuento
                        </CCardText>
                        {/* Precio con descuento */}
                        <CCardText className="text-lg font-bold text-green-600">
                          ${(
                            producto.precio -
                            (producto.precio * producto.promocion.descuento) / 100
                          )}
                        </CCardText>
                      </>
                    ) : (
                      // Caso cuando el producto no tiene promoción o el descuento es 0
                      <CCardText className="text-lg font-bold text-gray-800">
                        ${producto.precio}
                      </CCardText>
                    )}
                  </CCardBody>

                  <CCardFooter className="flex justify-between items-center">
                    <CButton
                      color="primary"
                      variant="outline"
                      href={`/productos/${producto.id}`}
                      className="d-flex align-items-center"
                    >
                      <FaHandPointUp className="me-2"/>
                      Ver detalles
                    </CButton>
                    <CButton
                      color="success"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      <FaShoppingCart />
                    </CButton>
                  </CCardFooter>
                </CCard>
              </CCol>
            ))}
          </CRow>
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
