import React, { useState, useEffect } from "react";
import { DevolucionesService } from "../../api/api.devoluciones";
import { EstadosAPI } from "../../api/api.estados";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import { FaExchangeAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionDevolucionesPage = () => {
  const [devoluciones, setDevoluciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedDevolucion, setSelectedDevolucion] = useState(null);
  const [nuevoEstadoId, setNuevoEstadoId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(""); // Filtro por estado

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        const devolucionesResponse = await DevolucionesService.obtenerTodasLasDevoluciones();
        setDevoluciones(devolucionesResponse || []);
      } catch (error) {
        console.error("Error al cargar devoluciones:", error);
        toast.error("Error al cargar las devoluciones.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEstados = async () => {
      try {
        const estadosResponse = await EstadosAPI.getEstados();
        const estadosFiltrados = estadosResponse.filter((estado) => estado.id >= 5 && estado.id <= 8);
        setEstados(estadosFiltrados);
      } catch (error) {
        console.error("Error al cargar estados:", error);
        toast.error("Error al cargar los estados.");
      }
    };

    fetchDevoluciones();
    fetchEstados();
  }, []);

  const handleEditEstado = async () => {
    try {
        if (!selectedDevolucion || !nuevoEstadoId) {
            toast.error("Debe seleccionarse un estado válido.");
            return;
        }

        console.log(`Intentando cambiar devolución ${selectedDevolucion.id} de estado ${selectedDevolucion.estadoId} a ${nuevoEstadoId}`);

        await DevolucionesService.actualizarEstadoDevolucion(selectedDevolucion.id, nuevoEstadoId);

        setDevoluciones((prev) =>
            prev.map((devolucion) =>
                devolucion.id === selectedDevolucion.id 
                    ? { ...devolucion, estadoId: nuevoEstadoId, estado: estados.find(e => e.id === nuevoEstadoId) } 
                    : devolucion
            )
        );

        setIsEditModalOpen(false);
        setSelectedDevolucion(null);
        setNuevoEstadoId(null);
        toast.success("Estado actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el estado de la devolución:", error);

        // Mostrar el mensaje exacto que viene del backend
        const mensajeError = error.response?.data?.error || "Error al actualizar el estado.";
        toast.error(mensajeError);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < Math.ceil(devoluciones.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filteredData = (devoluciones || [])
    .filter(
      (devolucion) =>
        devolucion.pedido.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devolucion.pedido.usuario?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devolucion.pedido.usuario?.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devolucion.pedidoId.toString().includes(searchTerm)
    )
    .filter((devolucion) => !selectedEstado || devolucion.estadoId.toString() === selectedEstado);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Devoluciones</h1>

        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por usuario, correo o pedido..."
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
          { key: "pedido", label: "Pedido" },
          { key: "producto", label: "Producto Devuelto" },
          { key: "motivo", label: "Motivo" },
          { key: "cantidadDevuelta", label: "Cantidad Devuelta" },
          { key: "estadoDevolucion", label: "Estado" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((devolucion) => ({
          usuario: `${devolucion.pedido?.usuario?.nombre || "N/A"} ${devolucion.pedido?.usuario?.apellido || ""}`,
          pedido: devolucion.pedidoId,
          estadoDevolucion: devolucion.estado?.nombre || "Desconocido",
          cantidadDevuelta: devolucion.cantidad || "No especificada",
          motivo: devolucion.motivo || "No especificado",
          estado: estados.find(e => e.id === devolucion.estadoId)?.nombre || "Desconocido",
          producto: devolucion.producto?.nombre || "Sin información",
          acciones: (
            <button
              onClick={() => {
                setSelectedDevolucion(devolucion);
                setIsEditModalOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaExchangeAlt size={20} />
            </button>
          ),
        }))}
      />

      <ModalComponent
        title={`Cambiar Estado de la Devolución #${selectedDevolucion?.id}`}
        visible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDevolucion(null);
          setNuevoEstadoId(null);
        }}
        onSave={handleEditEstado}
      >
        <select value={nuevoEstadoId || ""} onChange={(e) => setNuevoEstadoId(parseInt(e.target.value, 10))} className="w-full p-2 border rounded">
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

export default GestionDevolucionesPage;
