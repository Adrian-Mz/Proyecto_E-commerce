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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { FaShoppingCart, FaHandPointUp } from "react-icons/fa";
import { ProductosService } from "../../api/api.productos";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const ProductoDetailPage = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState(4); // Cantidad de productos visibles
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
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
        <div className="flex justify-center items-center w-4/5 h-96 bg-white shadow-lg rounded-lg">
          <img
            src={producto.imagen || "https://via.placeholder.com/500"}
            alt={producto.nombre}
            className="w-64 max-w-md rounded-lg"
          />
        </div>

        {/* Contenedor de detalles */}
        <div>
          <h1 className="text-3xl font-bold mb-4 text-black">{producto.nombre}</h1>
          
          {/* Mostrar mensaje de "Producto Agotado" si el stock es 0 */}
          {producto.stock === 0 ? (
            <p className="text-lg font-bold text-red-600">Producto Agotado</p>
          ) : (
            <>
              {/* Mostrar precios con IVA y descuentos si aplican */}
              {/* Mostrar precios con IVA y descuentos si aplican */}
                {producto.promocion && producto.promocion.descuento > 0 ? (
                  <>
                    <p className="text-sm text-gray-500 line-through">
                      ${parseFloat(producto.precio).toFixed(2)}  
                      <span className="text-xs">(IVA Incluido)</span>
                    </p>
                    <p className="text-red-600 font-semibold text-sm">
                      {producto.promocion.descuento}% de descuento
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ${parseFloat(producto.precio - (producto.precio * producto.promocion.descuento) / 100).toFixed(2)} 
                      <span className="text-xs">(IVA Incluido)</span>
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    ${parseFloat(producto.precio).toFixed(2)} 
                    <span className="text-xs">(IVA Incluido)</span>
                  </p>
                )}

            </>
          )}

          <p className="text-gray-700 mb-4">
            <strong>Marca:</strong> {producto.marca || "Sin especificar"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Stock:</strong> {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
          </p>
          <p className="text-gray-700 mb-6">{producto.descripcion}</p>
          
          <div className="w-40 flex flex-col gap-2">
            {/* Botón para abrir el modal de especificaciones */}
            <CButton 
              color="primary" 
              className="w-48 d-flex justify-center align-items-center py-2 text-base" 
              onClick={() => setVisible(true)}
            >
              <FaHandPointUp className="me-2" />
              Especificaciones
            </CButton>

            {/* Botón de agregar al carrito */}
            <CButton
              color="success"
              className="w-48 d-flex justify-center align-items-center py-2 text-base"
              onClick={() => agregarAlCarrito(producto)}
              disabled={producto.stock === 0}
            >
              <FaShoppingCart className="me-2" />
              Agregar al Carrito
            </CButton>
          </div>

          {/* 🔹 Modal con especificaciones */}
          <CModal
            alignment="center"
            scrollable
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="modal-especificaciones"
            size="xl"
          >
            <CModalHeader>
              <CModalTitle id="modal-especificaciones">Especificaciones del Producto</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {/* 🔹 Se mantiene el formato de saltos de línea */}
              <p className="text-gray-700 whitespace-pre-line">
                {producto.especificaciones}
              </p>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Cerrar
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
      </div>

      {/* Línea separadora */}
      <hr className="my-6 border-gray-600" />

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

                {/* Mostrar mensaje de "Producto Agotado" si el stock es 0 */}
                {relacionado.stock === 0 ? (
                  <CCardText className="text-lg font-bold text-red-600">Producto Agotado</CCardText>
                ) : (
                  <>
                    {relacionado.promocion && relacionado.precioConPromocion < relacionado.precio ? (
                      <>
                        <CCardText className="text-sm text-gray-500 line-through">
                          {`$${parseFloat(relacionado.precio).toFixed(2)}`}<span className="text-xs">(IVA Incluido)</span>
                        </CCardText>
                        <CCardText className="text-red-600 font-semibold text-sm">
                          {relacionado.promocion.descuento}% de descuento
                        </CCardText>
                        <CCardText className="text-lg font-bold text-green-600">
                          {`$${relacionado.precioConPromocion}`} <span className="text-xs">(IVA Incluido)</span>
                        </CCardText>
                      </>
                    ) : (
                      <>
                        <CCardText className="text-lg font-bold text-green-600">
                          {`$${parseFloat(relacionado.precio).toFixed(2)}`}<span className="text-xs"> (IVA Incluido)</span>
                        </CCardText>
                      </>
                    )}
                  </>
                )}
              </CCardBody>

              <CCardFooter className="flex justify-between">
                <CButton color="primary" variant="outline" href={`/productos/${relacionado.id}`}>
                  Ver Detalles
                </CButton>
                <CButton
                  color="success"
                  onClick={() => agregarAlCarrito(relacionado)}
                  disabled={relacionado.stock === 0}
                  className={relacionado.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}
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
