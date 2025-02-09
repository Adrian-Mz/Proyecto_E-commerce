import React, { useState, useEffect } from "react";
import { DevolucionesService } from "../../api/api.devoluciones";
import { PedidosAPI } from "../../api/api.pedidos";
import { CCollapse, CButton, CCard, CCardBody, CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronDown, FaUndoAlt } from "react-icons/fa";

const UsuarioDevolucionesPage = () => {
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  const [devolucionesUsuario, setDevolucionesUsuario] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePedidos, setVisiblePedidos] = useState({});
  const [showAlert, setShowAlert] = useState(true);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    const fetchPedidosEntregados = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (!usuario || !usuario.id) {
          toast.error("No se encontró el usuario.");
          return;
        }

        const response = await PedidosAPI.getPedidos();
        const pedidos = Array.isArray(response.pedidos) ? response.pedidos : [];

        const pedidosFiltrados = pedidos.filter((p) => p.estadoId === 4 && p.usuarioId === usuario.id);
        setPedidosEntregados(pedidosFiltrados);

        // Obtener devoluciones activas del usuario
        const devoluciones = await DevolucionesService.obtenerTodasLasDevoluciones();
        const devolucionesFiltradas = devoluciones.filter((d) => pedidosFiltrados.some((p) => p.id === d.pedidoId));
        setDevolucionesUsuario(devolucionesFiltradas);
      } catch (error) {
        console.error("Error al cargar los pedidos entregados:", error);
        toast.error("Error al cargar los pedidos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidosEntregados();
  }, []);

  const obtenerEstadoProducto = (productoId) => {
    const devolucion = devolucionesUsuario.find((d) => d.productoId === productoId);
    return devolucion
      ? { estado: devolucion.estado?.nombre || "En proceso", motivo: devolucion.motivo || "Sin motivo registrado" }
      : { estado: "Sin devolución", motivo: "" };
  };
  
  const renderizarProductos = (pedido) => (
    <ul>
      {pedido.productos.map((producto) => {
        const { estado: estadoProducto, motivo: motivoDevolucion } = obtenerEstadoProducto(producto.productoId);
        const estaSeleccionado = productosSeleccionados.some((p) => p.productoId === producto.productoId);
        const estaEnDevolucion = estadoProducto !== "Sin devolución";
  
        return (
          <li key={producto.productoId} className={`border p-3 rounded-lg shadow-sm mb-2 ${estaEnDevolucion ? "bg-gray-200 opacity-70" : ""}`}>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={estaSeleccionado}
                disabled={estaEnDevolucion}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProductosSeleccionados((prev) => [
                      ...prev,
                      {
                        productoId: producto.productoId,
                        cantidad: producto.cantidad,
                        motivo: "",
                      },
                    ]);
                  } else {
                    setProductosSeleccionados((prev) => prev.filter((p) => p.productoId !== producto.productoId));
                  }
                }}
              />
              <img
                src={producto.producto?.imagen || "/placeholder.png"}
                alt={producto.producto?.nombre || "Producto"}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h5 className="font-bold text-sm">{producto.producto?.nombre}</h5>
                <p className="text-xs text-gray-500">{producto.producto?.marca}</p>
                <p className="text-xs text-gray-500">{`Cantidad: ${producto.cantidad}`}</p>
              </div>
            </div>
  
            {/* Estado del Producto */}
            {estadoProducto !== "Sin devolución" && (
              <div className="mt-2 p-2 text-blue-700 bg-blue-100 border border-blue-400 rounded">
                <strong>Estado del Producto:</strong> {estadoProducto}
              </div>
            )}
  
            {/* Motivo de devolución si está en proceso */}
            {estaEnDevolucion && motivoDevolucion && (
              <div className="mt-2 p-2 text-purple-700 bg-purple-100 border border-purple-400 rounded">
                <strong>Motivo:</strong> {motivoDevolucion}
              </div>
            )}
  
            {/* Selector de motivo */}
            <select
              className="mt-2 p-2 border rounded w-full"
              disabled={!estaSeleccionado}
              onChange={(e) => {
                const selectedMotivo = e.target.value;
                setProductosSeleccionados((prev) =>
                  prev.map((p) => (p.productoId === producto.productoId ? { ...p, motivo: selectedMotivo } : p))
                );
              }}
            >
              <option value="">Seleccione un motivo</option>
              {[
                "Producto defectuoso",
                "Recibí un artículo incorrecto",
                "Cambio de opinión",
                "Producto dañado en el transporte",
                "Producto con características extrañas",
                "Motivo desconocido",
              ].map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
  
            {/* Botón de devolución ajustado */}
            <CButton
              color="secondary"
              className="rounded-3xl mt-2 w-48 d-flex justify-center align-items-center py-2 text-base"
              disabled={!estaSeleccionado || !productosSeleccionados.find((p) => p.productoId === producto.productoId)?.motivo}
              onClick={() => handleDevolucion(pedido.id, producto.productoId)}
            >
              <FaUndoAlt className="mr-2 text-base" />
              Solicitar
            </CButton>
          </li>
        );
      })}
    </ul>
  );
  
  const handleDevolucion = async (pedidoId, productoId) => {
    try {
      const producto = productosSeleccionados.find((p) => p.productoId === productoId);

      if (!producto || !producto.motivo.trim()) {
        toast.error("Debe seleccionar un motivo para la devolución.");
        return;
      }

      await DevolucionesService.registrarDevolucion(pedidoId, producto.productoId, producto.cantidad, producto.motivo);

      toast.success("Solicitud de devolución registrada correctamente.");

      // Actualizar estado sin recargar la página
      setDevolucionesUsuario((prev) => [
        ...prev,
        { pedidoId, productoId, estado: { nombre: "Devolución Pendiente" } },
      ]);

      setProductosSeleccionados((prev) => prev.filter((p) => p.productoId !== productoId));
    } catch (error) {
      console.error("Error al registrar la devolución:", error);
      toast.error(error.response?.data?.error || "No se pudo registrar la devolución.");
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
              <CCardBody className="mt-3">{renderizarProductos(pedido)}</CCardBody>
            </CCollapse>
          </CCard>
        ))
      )}
    </div>
  );
};

export default UsuarioDevolucionesPage;
