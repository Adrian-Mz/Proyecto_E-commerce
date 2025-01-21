import React, { useState, useEffect } from "react";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import { PedidosAPI } from "../../api/api.pedidos";
import { EstadosAPI } from "../../api/api.estados";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const UsuarioPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPedidosAndEstados = async () => {
      try {
        const [pedidosResponse, estadosResponse] = await Promise.all([
          PedidosAPI.getHistorialPedidos(),
          EstadosAPI.getEstados(),
        ]);

        setPedidos(pedidosResponse.pedidos || []);
        // Mapea los estados para acceder rápidamente por ID
        const estadosMap = estadosResponse.reduce((acc, estado) => {
          acc[estado.id] = estado.nombre;
          return acc;
        }, {});
        setEstados(estadosMap);
      } catch (error) {
        console.error("Error al cargar el historial de pedidos:", error);
        toast.error("Error al cargar el historial de pedidos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidosAndEstados();
  }, []);

  const handleVerPedido = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    setSelectedPedido(pedido);
    setIsModalOpen(true);
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
      <TableComponent
        columns={[
          { key: "id", label: "ID" },
          { key: "fechaPedido", label: "Fecha de Pedido" },
          { key: "estadoId", label: "Estado" },
          { key: "total", label: "Total" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedPedidos.map((pedido) => ({
          ...pedido,
          fechaPedido: new Date(pedido.fechaPedido).toLocaleDateString(),
          estadoId: estados[pedido.estadoId] || "Desconocido", // Usa el nombre del estado
          total: `$${parseFloat(pedido.total || 0).toFixed(2)}`, // Validación adicional
          acciones: (
            <div className="flex space-x-2">
              <button
                onClick={() => handleVerPedido(pedido.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEye size={16} />
              </button>
            </div>
          ),
        }))}
      />

      <ModalComponent
        title={`Detalles del Pedido #${selectedPedido?.id}`}
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedPedido?.productos?.length > 0 ? (
          <div className="space-y-4">
            {selectedPedido.productos.map((producto) => (
              <div
                key={producto.productoId}
                className="flex items-center border-b pb-4"
              >
                <img
                  src={producto.producto?.imagen || "/placeholder.png"}
                  alt={producto.producto?.nombre || "Producto"}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <h5 className="font-bold">{producto.producto?.nombre}</h5>
                  <p className="text-sm text-gray-500">{producto.producto?.marca}</p>
                  <p className="text-sm text-gray-500">{`Cantidad: ${producto.cantidad}`}</p>
                  <p className="text-sm font-semibold">
                    {`$${parseFloat(producto.precio_unitario || 0).toFixed(2)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay productos en este pedido.</p>
        )}
      </ModalComponent>
    </div>
  );
};

export default UsuarioPedidosPage;
