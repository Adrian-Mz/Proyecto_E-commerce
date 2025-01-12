import React, { useState, useEffect } from "react";
import TableComponent from "../components/UI/TableComponent";
import ModalComponent from "../components/UI/ModalComponent";
import { PromocionesService } from "../api/api.promociones";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionPromocionesPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newPromocion, setNewPromocion] = useState({
    nombre: "",
    descripcion: "",
    descuento: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promocionesResponse = await PromocionesService.getPromociones();
        setData(promocionesResponse || []);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
        toast.error("Error al cargar las promociones.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearNewPromocion = () => {
    setNewPromocion({
      nombre: "",
      descripcion: "",
      descuento: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleAddPromocion = async () => {
    try {
      const newPromocionData = {
        ...newPromocion,
        descuento: parseFloat(newPromocion.descuento),
        fechaInicio: newPromocion.fechaInicio || null,
        fechaFin: newPromocion.fechaFin || null,
      };

      const createdPromocion = await PromocionesService.createPromocion(newPromocionData);

      setData((prevData) => [...prevData, createdPromocion]);
      clearNewPromocion();
      setIsAddModalOpen(false);
      toast.success("Promoción añadida correctamente.");
    } catch (error) {
      console.error("Error al añadir promoción:", error);
      toast.error("Error al añadir promoción.");
    }
  };

  const handleEditPromocion = async () => {
    try {
      if (selectedPromocion) {
        const updatedPromocionData = {
          nombre: selectedPromocion.nombre,
          descripcion: selectedPromocion.descripcion,
          descuento: parseFloat(selectedPromocion.descuento),
          fechaInicio: selectedPromocion.fechaInicio || null,
          fechaFin: selectedPromocion.fechaFin || null,
        };

        const updatedPromocion = await PromocionesService.updatePromocion(
          selectedPromocion.id,
          updatedPromocionData
        );

        setData((prevData) =>
          prevData.map((item) =>
            item.id === updatedPromocion.id ? updatedPromocion : item
          )
        );

        setSelectedPromocion(null);
        setIsEditModalOpen(false);
        toast.success("Promoción editada correctamente.");
      }
    } catch (error) {
      console.error("Error al editar promoción:", error);
      toast.error("Error al editar promoción.");
    }
  };

  const handleDeletePromocion = async (id) => {
    try {
      await PromocionesService.deletePromocion(id);
      setData((prevData) => prevData.filter((item) => item.id !== id));
      toast.success("Promoción eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar promoción:", error);
      toast.error("Error al eliminar promoción.");
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Promociones</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setIsAddModalOpen(true);
            clearNewPromocion();
          }}
        >
          Añadir
        </button>
      </div>
      <TableComponent
        columns={[
          { key: "id", label: "ID" },
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "descuento", label: "Descuento (%)" },
          { key: "fechaInicio", label: "Fecha Inicio" },
          { key: "fechaFin", label: "Fecha Fin" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((item) => ({
          ...item,
          descuento: item.descuento ? `${parseFloat(item.descuento).toFixed(2)}%` : "0.00%", // Convertir y manejar valores nulos o vacíos
          fechaInicio: item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString() : "-",
          fechaFin: item.fechaFin ? new Date(item.fechaFin).toLocaleDateString() : "-",
          acciones: (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedPromocion(item);
                  setIsEditModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => handleDeletePromocion(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ),
        }))}
      />
      <ModalComponent
        title="Añadir Promoción"
        visible={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          clearNewPromocion();
        }}
        onSave={handleAddPromocion}
      >
        {renderPromocionInputs(newPromocion, setNewPromocion)}
      </ModalComponent>
      <ModalComponent
        title={`Editar Promoción ${selectedPromocion?.id}`}
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditPromocion}
      >
        {renderPromocionInputs(selectedPromocion, setSelectedPromocion)}
      </ModalComponent>
      <div className="flex justify-end items-center mt-4">
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
  );
};

const renderPromocionInputs = (promocion, setPromocion) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label>Nombre:</label>
      <input
        type="text"
        value={promocion?.nombre || ""}
        onChange={(e) => setPromocion((prev) => ({ ...prev, nombre: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Descripción:</label>
      <textarea
        value={promocion?.descripcion || ""}
        onChange={(e) => setPromocion((prev) => ({ ...prev, descripcion: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Descuento (%):</label>
      <input
        type="number"
        value={promocion?.descuento || ""}
        onChange={(e) => setPromocion((prev) => ({ ...prev, descuento: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Fecha Inicio:</label>
      <input
        type="date"
        value={promocion?.fechaInicio || ""}
        onChange={(e) => setPromocion((prev) => ({ ...prev, fechaInicio: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Fecha Fin:</label>
      <input
        type="date"
        value={promocion?.fechaFin || ""}
        onChange={(e) => setPromocion((prev) => ({ ...prev, fechaFin: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
  </div>
);

export default GestionPromocionesPage;
