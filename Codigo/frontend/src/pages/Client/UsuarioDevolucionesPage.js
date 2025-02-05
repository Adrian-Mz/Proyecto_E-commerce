import React, { useState, useEffect } from "react";
import { DevolucionesService } from "../../api/api.devoluciones";
import { PedidosAPI } from "../../api/api.pedidos";
import { CCollapse, CButton, CCard, CCardBody, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronDown, FaUndoAlt } from "react-icons/fa";

const MOTIVOS_DEVOLUCION = [
    "Producto defectuoso",
    "Recibí un artículo incorrecto",
    "Cambio de opinión",
    "Producto dañado en el transporte",
    "Producto con características extrañas",
    "Motivo desconocido",
];

const UsuarioDevolucionesPage = () => {
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  const [productosEnProcesoDevolucion, setProductosEnProcesoDevolucion] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [productosDevueltos, setProductosDevueltos] = useState([]);
  const [visiblePedidos, setVisiblePedidos] = useState({});
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const fetchPedidosEntregados = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario || !usuario.id) {
          toast.error("No se encontró el usuario.");
          return;
        }
  
        const response = await PedidosAPI.getPedidos();
        console.log("Respuesta de API pedidos:", response);
  
        const pedidos = Array.isArray(response.pedidos) ? response.pedidos : [];
        if (!Array.isArray(pedidos)) {
          console.error("Error: La respuesta de pedidos no es un array.");
          return;
        }
  
        const pedidosFiltrados = pedidos.filter(p => p.estadoId === 4 && p.usuarioId === usuario.id);
        setPedidosEntregados(pedidosFiltrados);
  
        // Obtener devoluciones activas
        const devoluciones = await DevolucionesService.obtenerTodasLasDevoluciones();
        const productosEnDevolucion = {};
  
        devoluciones.forEach((devolucion) => {
          devolucion.productos.forEach((producto) => {
            if (!productosEnDevolucion[devolucion.pedidoId]) {
              productosEnDevolucion[devolucion.pedidoId] = new Map();
            }
            productosEnDevolucion[devolucion.pedidoId].set(producto.productoId, producto.estadoId);
          });
        });
  
        setProductosEnProcesoDevolucion(productosEnDevolucion);
      } catch (error) {
        console.error("Error al cargar los pedidos entregados:", error);
        toast.error("Error al cargar los pedidos.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPedidosEntregados();
  }, []);
  
    const renderizarProductos = (pedido) => (
        <ul>
            {pedido.productos.map((producto) => {
                const enProceso = productosEnProcesoDevolucion[pedido.id]?.has(producto.productoId);

                return (
                    <li key={producto.productoId} 
                        className={`flex flex-col border p-2 rounded-lg shadow-sm mb-2 ${enProceso ? "opacity-50" : ""}`}>
                        
                        <div className="flex items-center space-x-2">
                            <img
                                src={producto.producto?.imagen || "/placeholder.png"}
                                alt={producto.producto?.nombre || "Producto"}
                                className="w-14 h-14 object-cover rounded"
                            />
                            <div>
                                <h5 className="font-bold text-sm">{producto.producto?.nombre}</h5>
                                <p className="text-xs text-gray-500">{producto.producto?.marca}</p>
                                <p className="text-xs text-gray-500">{`Cantidad: ${producto.cantidad}`}</p>
                            </div>
                        </div>

                        {/* 🔹 Mostrar mensaje si está en proceso de devolución */}
                        {enProceso && (
                            <div className="mt-2 p-2 text-red-600 bg-red-100 border border-red-400 rounded">
                                <strong>⚠ Con proceso de devolución</strong>
                            </div>
                        )}

                        {/* 🔹 Selector de motivo de devolución */}
                        <select
                            className="mt-2 p-2 border rounded"
                            disabled={enProceso}
                            onChange={(e) => {
                                const selectedMotivo = e.target.value;
                                setProductosDevueltos((prev) => {
                                    const newProductos = prev.filter(p => p.productoId !== producto.productoId);
                                    if (selectedMotivo) {
                                        newProductos.push({
                                            productoId: producto.productoId,
                                            cantidad: producto.cantidad,
                                            motivo: selectedMotivo
                                        });
                                    }
                                    return newProductos;
                                });
                            }}
                        >
                            <option value="">Seleccione un motivo</option>
                            {MOTIVOS_DEVOLUCION.map((motivo) => (
                                <option key={motivo} value={motivo}>
                                    {motivo}
                                </option>
                            ))}
                        </select>
                    </li>
                );
            })}
        </ul>
    );

  const handleDevolucion = async (pedidoId) => {
    try {
        if (productosDevueltos.length === 0) {
            toast.error("Debe seleccionar al menos un producto para devolver.");
            return;
        }

        // Verificar que cada producto tenga un motivo antes de enviarlo
        const productosValidos = productosDevueltos.filter(p => p.motivo && p.motivo.trim() !== "");

        if (productosValidos.length === 0) {
            toast.error("Todos los productos deben tener un motivo de devolución.");
            return;
        }

        await DevolucionesService.registrarDevolucion(pedidoId, productosValidos);
        toast.success("Solicitud de devolución registrada correctamente.");
        setProductosDevueltos([]);
    } catch (error) {
        console.error("Error al registrar la devolución:", error);
        toast.error("No se pudo registrar la devolución.");
    }
  };

  const handleToggleCollapse = (pedidoId) => {
    setVisiblePedidos((prev) => ({
      ...prev,
      [pedidoId]: !prev[pedidoId],
    }));
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Devoluciones</h1>

      {/* Modal centrado con @coreui/react */}
      <CModal alignment="center" visible={showAlert} onClose={() => setShowAlert(false)}>
        <CModalHeader>
          <CModalTitle>Atención</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Para hacer una solicitud, 
            su orden debe haber sido entregada y no deben haber
            pasado más de 7 días desde la entrega.
            Gracias por su colaboración.
          </p>
        </CModalBody>
        <CButton color="primary" className="m-3" onClick={() => setShowAlert(false)}>
          Aceptar
        </CButton>
      </CModal>

      {isLoading ? (
        <div className="text-center">Cargando pedidos...</div>
      ) : pedidosEntregados.length === 0 ? (
        <p>¡Sin devoluciones aun! 😢</p>
      ) : (
        pedidosEntregados.map((pedido) => (
          <CCard key={pedido.id} className="p-4 shadow-md bg-white rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Pedido entregado el {new Date(pedido.fechaActualizacion).toLocaleDateString("es-ES")}
              </h2>
              <CButton color="primary" size="sm" onClick={() => handleToggleCollapse(pedido.id)}>
                <FaChevronDown />
              </CButton>
            </div>

            <CCollapse visible={visiblePedidos[pedido.id]}>
              <CCardBody className="mt-3">
                <h3 className="font-semibold mt-3 mb-2">Selecciona los productos a devolver:</h3>
                {renderizarProductos(pedido)}
                <CButton 
                    color="danger" 
                    className="w-48 d-flex justify-center align-items-center py-2 text-slate-300" 
                    onClick={() => handleDevolucion(pedido.id)}
                >
                  <FaUndoAlt className="me-2" />
                  Solicitar Devolución
                </CButton>
              </CCardBody>
            </CCollapse>
          </CCard>
        ))
      )}
    </div>
  );
};

export default UsuarioDevolucionesPage;
