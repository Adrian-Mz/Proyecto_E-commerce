import React, { useState, useEffect } from "react";
import { PedidosAPI } from "../../api/api.pedidos";
import { EstadosAPI } from "../../api/api.estados";
import { CCollapse, CButton, CCard, CCardBody, CProgress } from "@coreui/react";
import { FaChevronDown, FaBoxOpen, FaCog, FaShippingFast, FaCheckCircle } from "react-icons/fa"; 
import { toast } from "react-toastify";

const UsuarioPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePedidos, setVisiblePedidos] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPedidosAndEstados = async () => {
      try {
        const [pedidosResponse, estadosResponse] = await Promise.all([
          PedidosAPI.getPedidos(), // Ahora usamos esta función para obtener pedidos
          EstadosAPI.getEstados(),
        ]);

        setPedidos(pedidosResponse.pedidos || []);
        const estadosMap = estadosResponse.reduce((acc, estado) => {
          acc[estado.id] = estado.nombre;
          return acc;
        }, {});
        setEstados(estadosMap);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        toast.error("Error al cargar los pedidos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidosAndEstados();
  }, []);

  const handleToggleCollapse = (pedidoId) => {
    setVisiblePedidos((prev) => ({
      ...prev,
      [pedidoId]: !prev[pedidoId],
    }));
  };

  const estadosOrdenados = [
    { nombre: "Pendiente", icon: <FaBoxOpen className="text-green-500 text-lg" /> },
    { nombre: "Procesando", icon: <FaCog className="text-yellow-500 text-lg" /> },
    { nombre: "Enviado", icon: <FaShippingFast className="text-orange-500 text-lg" /> },
    { nombre: "Entregado", icon: <FaCheckCircle className="text-green-500 text-lg" /> },
  ];

  const getProgressValue = (estado) => {
    switch (estado) {
      case "Pendiente":
        return { value: 25, color: "secondary" };
      case "Procesando":
        return { value: 50, color: "secondary" };
      case "Enviado":
        return { value: 75, color: "secondary" };
      case "Entregado":
        return { value: 100, color: "success" };
      default:
        return { value: 0, color: "secondary" };
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (
      direction === "next" &&
      currentPage < Math.ceil(pedidos.length / itemsPerPage)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedPedidos = pedidos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(pedidos.length / itemsPerPage);

  if (isLoading) {
    return <div className="text-center">Cargando pedidos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 mx-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span className="text-gray-700">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            className="px-4 py-2 mx-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedPedidos.map((pedido) => {
          const estadoNombre = estados[pedido.estadoId] || "Desconocido";
          const progress = getProgressValue(estadoNombre);

          return (
            <CCard key={pedido.id} className="p-4 shadow-md bg-white rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Pedido realizado el {new Date(pedido.fechaPedido).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <CButton color="primary" size="sm" onClick={() => handleToggleCollapse(pedido.id)}>
                  <FaChevronDown />
                </CButton>
              </div>

              <CCollapse visible={visiblePedidos[pedido.id]}>
                <CCardBody className="mt-3">
                  <CProgress
                    animated
                    variant="striped"
                    color={progress.color}
                    value={progress.value}
                    className="mb-3"
                  />

                  <div className="flex justify-between items-center w-full mt-3 relative">
                    {estadosOrdenados.map((estado, index) => {
                      const estadoActualizado = pedido?.historialEstados?.find((e) => e.estado?.nombre === estado.nombre);
                      
                      return (
                        <div key={estado.nombre} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-bold ${
                              estadosOrdenados.findIndex((e) => e.nombre === pedido.estado.nombre) >= index
                                ? "bg-gray-300"
                                : "bg-gray-100"
                            }`}
                          >
                            {estado.icon}
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{estado.nombre}</p>
                          <p className="text-xs text-gray-500">
                            Método de Envío: {pedido?.metodoEnvio?.nombre || "No especificado"}
                          </p>
                          {estado.nombre === "Pendiente" ? (
                            <p className="text-xs text-gray-500">
                              Fecha Pedido: {pedido?.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString() : "--"}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Fecha Actualización: {estadoActualizado?.fechaCambio ? new Date(estadoActualizado.fechaCambio).toLocaleDateString() : "--"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <hr className="my-4 border-black" />

                  <div className="grid grid-cols-3 gap-4">
                    {pedido.productos.map((producto) => (
                      <div
                        key={producto.productoId}
                        className="flex items-center justify-between border p-2 rounded-lg shadow-sm"
                      >
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
                        <p className="text-sm font-semibold text-right">
                          {`$${(producto.cantidad * producto.precio_unitario).toFixed(2)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CCardBody>
              </CCollapse>
            </CCard>
          );
        })}
      </div>
    </div>
  );
};

export default UsuarioPedidosPage;
