import React, { useState, useEffect } from "react";
import { PedidosAPI } from "../../api/api.pedidos";
import { EstadosAPI } from "../../api/api.estados";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import { FaExchangeAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedPedido, setSelectedPedido] = useState(null);
  const [nuevoEstadoId, setNuevoEstadoId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(""); // Filtro por estado

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidosResponse = await PedidosAPI.getPedidos();
        
        // Agregar historial de estados a cada pedido
        const pedidosConHistorial = pedidosResponse.pedidos.map((pedido) => ({
          ...pedido,
          historialEstados: pedido.historialEstados || [],
        }));

        setPedidos(pedidosConHistorial);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        toast.error("Error al cargar los pedidos.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEstados = async () => {
      try {
        const estadosResponse = await EstadosAPI.getEstados();
        
        // Filtrar los estados que solo queremos mostrar
        const estadosFiltrados = estadosResponse.filter((estado) =>
          ["Pendiente", "Procesando", "Enviado", "Entregado"].includes(estado.nombre)
        );

        setEstados(estadosFiltrados);
      } catch (error) {
        console.error("Error al cargar estados:", error);
        toast.error("Error al cargar los estados.");
      }
    };

    fetchPedidos();
    fetchEstados();
  }, []);

  const handleEditEstado = async () => {
    try {
      if (selectedPedido && nuevoEstadoId) {
        await EstadosAPI.updateEstadoPedido(selectedPedido.id, nuevoEstadoId);

        // Actualizar el estado local del pedido y su historial
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.id === selectedPedido.id
              ? {
                  ...pedido,
                  estadoId: nuevoEstadoId,
                  historialEstados: [
                    ...pedido.historialEstados,
                    { estadoId: nuevoEstadoId, fechaCambio: new Date().toISOString() },
                  ],
                }
              : pedido
          )
        );

        setSelectedPedido(null);
        setNuevoEstadoId(null);
        setIsEditModalOpen(false);
        toast.success("Estado del pedido actualizado correctamente.");
      }
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      toast.error("Error al actualizar el estado.");
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < Math.ceil(pedidos.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filteredData = pedidos
  .filter((pedido) =>
    pedido.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.usuario?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.usuario?.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.direccionEnvio.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((pedido) => !selectedEstado || pedido.estadoId.toString() === selectedEstado);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
         {/* Barra de búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por usuario, correo o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded pl-10 w-64 text-gray-700"
            />
          </div>

          {/* Filtro por Estado */}
          <select
            className="border p-2 rounded text-gray-700"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.nombre}
              </option>
            ))}
          </select>

          {/* Paginación */}
          <div className="flex items-center space-x-2">
            <button
              className="px-1 py-1 mx-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span className="text-gray-700">{`${currentPage} de ${totalPages || 1}`}</span>
            <button
              className="px-1 py-1 mx-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &gt;
            </button>
          </div>
      </div>
      <TableComponent
        columns={[
          { key: "usuario", label: "Usuario" },
          { key: "correo", label: "Correo" },
          { key: "direccionEnvio", label: "Dirección de Envío" },
          { key: "total", label: "Total" },
          { key: "estado", label: "Estado" },
          { key: "historial", label: "Historial de Estados" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((pedido) => ({
          ...pedido,
          usuario: `${pedido.usuario?.nombre || "N/A"} ${pedido.usuario?.apellido || "N/A"}`,
          correo: pedido.usuario?.correo || "N/A",
          estado: estados.find((estado) => estado.id === pedido.estadoId)?.nombre || "Desconocido",
          historial: (
            <ul className="list-disc ml-4">
              {pedido.historialEstados.map((historial) => (
                <li key={historial.estadoId}>
                  {estados.find((e) => e.id === historial.estadoId)?.nombre || "Desconocido"} -{" "}
                  {new Date(historial.fechaCambio).toLocaleString()}
                </li>
              ))}
            </ul>
          ),
          acciones: (
            <button
              onClick={() => {
                setSelectedPedido(pedido);
                setIsEditModalOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaExchangeAlt size={24} className="" />
            </button>
          ),
        }))}
      />
      <ModalComponent
        title={`Cambiar Estado del Pedido #${selectedPedido?.id}`}
        visible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPedido(null);
          setNuevoEstadoId(null);
        }}
        onSave={handleEditEstado}
      >
        <select
          value={nuevoEstadoId || ""}
          onChange={(e) => setNuevoEstadoId(parseInt(e.target.value, 10))}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleccionar Estado</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nombre}
            </option>
          ))}
        </select>
      </ModalComponent>
    </div>
  );
};

export default GestionPedidosPage;
