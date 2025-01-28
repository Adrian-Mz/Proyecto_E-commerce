import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardImage,
  CCardText,
  CCardTitle,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import { FaShoppingCart } from "react-icons/fa";
import { ProductosService } from "../../api/api.productos";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const ProductoDetailPage = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState(4); // Cantidad de productos visibles
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await ProductosService.getProductoById(id);

        // Calcular el precio con descuento si hay promoción
        if (data.promocion) {
          const descuento = parseFloat(data.promocion.descuento) / 100;
          const precioConDescuento = (
            data.precio -
            data.precio * descuento
          ).toFixed(2); // Asegurar 2 decimales

          data.precio_unitario = precioConDescuento;
          data.mensajePromocion = `Precio con descuento $${precioConDescuento}.`;
        } else {
          data.mensajePromocion = "Sin descuento aplicado.";
        }

        setProducto(data);

        // Obtener productos relacionados de la misma categoría
        if (data.categoriaId) {
          const productosRelacionados = await ProductosService.getProductosPorCategoria(
            data.categoriaId
          );
          setProductosRelacionados(
            productosRelacionados.productos.filter((p) => p.id !== id)
          );
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        toast.error("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const agregarAlCarrito = (producto) => {
    try {
      addToCart(producto);
      toast.success(`${producto.nombre} agregado al carrito.`);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      toast.error("Error al agregar producto al carrito.");
    }
  };

  const mostrarMasProductos = () => {
    setProductosVisibles((prev) => prev + 4);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando producto...</p>;
  }

  if (!producto) {
    return <p className="text-center text-red-500">Producto no encontrado</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contenedor de imagen */}
        <div className="flex justify-center items-center">
          <img
            src={producto.imagen || "https://via.placeholder.com/500"}
            alt={producto.nombre}
            className="w-full max-w-lg rounded-lg shadow-lg"
          />
        </div>

        {/* Contenedor de detalles */}
        <div>
          <h1 className="text-3xl font-bold mb-4 text-black">{producto.nombre}</h1>
          {producto.promocion ? (
            <>
              {/* Precio original tachado */}
              <p className="text-xl font-bold text-gray-500 line-through">{`$${producto.precio}`}</p>
              {/* Precio con descuento */}
              <p className="text-2xl font-bold text-blue-600 mb-2">{`$${producto.precio_unitario}`}</p>
              {/* Mensaje de promoción */}
              <p className="text-lg text-red-500 font-bold mb-4">
               {producto.promocion.nombre}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-blue-600 mb-2">{`$${producto.precio}`}</p>
          )}
          <p className="text-gray-700 mb-4">
            <strong>Marca:</strong> {producto.marca || "Sin especificar"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Stock:</strong> {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
          </p>
          <p className="text-gray-700 mb-6">{producto.descripcion}</p>
          <CButton
            color="success"
            className="d-flex align-items-center"
            onClick={() => agregarAlCarrito(producto)}
          >
            <FaShoppingCart className="me-2" />
            Agregar al Carrito
          </CButton>
        </div>
      </div>

      {/* Línea separadora */}
      <hr className="my-6 border-gray-300" />

      {/* Productos relacionados */}
      <h2 className="text-2xl font-bold mb-4">Productos Relacionados</h2>
      <CRow className="g-4">
        {productosRelacionados.slice(0, productosVisibles).map((relacionado) => (
          <CCol xs={12} sm={6} md={4} lg={3} key={relacionado.id}>
            <CCard className="h-100">
              <CCardImage
                orientation="top"
                src={relacionado.imagen || "https://via.placeholder.com/150"}
                alt={relacionado.nombre}
                className="p-3"
              />
              <CCardBody>
                <CCardTitle className="text-black text-lg font-bold">
                  {relacionado.nombre}
                </CCardTitle>
                {relacionado.promocion ? (
                  <>
                    {/* Precio original tachado */}
                    <CCardText className="text-sm text-gray-500 line-through">{`$${relacionado.precio}`}</CCardText>
                    {/* Precio con descuento */}
                    <CCardText className="text-lg font-bold text-blue-600">{`$${(
                      relacionado.precio -
                      relacionado.precio *
                        (parseFloat(relacionado.promocion.descuento) / 100)
                    ).toFixed(2)}`}</CCardText>
                  </>
                ) : (
                  <CCardText className="text-lg font-bold text-blue-600">{`$${relacionado.precio}`}</CCardText>
                )}
              </CCardBody>
              <CCardFooter className="flex justify-between">
                <CButton
                  color="primary"
                  variant="outline"
                  href={`/productos/${relacionado.id}`}
                >
                  Ver Detalles
                </CButton>
                <CButton
                  color="success"
                  onClick={() => agregarAlCarrito(relacionado)}
                >
                  <FaShoppingCart />
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Botón para mostrar más productos */}
      {productosRelacionados.length > productosVisibles && (
        <div className="text-center mt-4">
          <CButton color="primary" onClick={mostrarMasProductos}>
            Mostrar más productos
          </CButton>
        </div>
      )}
    </div>
  );
};

export default ProductoDetailPage;
