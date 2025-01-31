import React, { useState, useEffect } from "react";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import { CategoriasService } from "../../api/api.categorias";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionCategoriasPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newCategoria, setNewCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasResponse = await CategoriasService.getCategorias();
        setData(categoriasResponse || []);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        toast.error("Error al cargar las categorías.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const clearNewCategoria = () => {
    setNewCategoria({
      nombre: "",
      descripcion: "",
    });
  };

  const handleAddCategoria = async () => {
    try {
      const createdCategoria = await CategoriasService.createCategoria(newCategoria);
  
      // Actualizar el estado local con la nueva categoría
      setData((prevData) => [...prevData, createdCategoria]);
  
      clearNewCategoria();
      setIsAddModalOpen(false);
      toast.success("Categoría añadida correctamente.");
    } catch (error) {
      console.error("Error al añadir categoría:", error.response?.data || error.message);
      toast.error("Error al añadir categoría.");
    }
  };

  const handleEditCategoria = async () => {
    try {
      if (selectedCategoria) {
        const updatedCategoria = await CategoriasService.updateCategoria(
          selectedCategoria.id,
          selectedCategoria
        );
  
        // Actualizar el estado local con la categoría editada
        setData((prevData) =>
          prevData.map((item) =>
            item.id === updatedCategoria.id ? updatedCategoria : item
          )
        );
  
        setSelectedCategoria(null);
        setIsEditModalOpen(false);
        toast.success("Categoría editada correctamente.");
      }
    } catch (error) {
      console.error("Error al editar categoría:", error.response?.data || error.message);
      toast.error("Error al editar categoría.");
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setIsAddModalOpen(true);
            clearNewCategoria();
          }}
        >
          Añadir
        </button>
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
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((categoria) => ({
          ...categoria,
          acciones: (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedCategoria(categoria);
                  setIsEditModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit size={16} />
              </button>
            </div>
          ),
        }))}
      />
      <ModalComponent
        title="Añadir Categoría"
        visible={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          clearNewCategoria();
        }}
        onSave={handleAddCategoria}
      >
        {renderCategoriaInputs(newCategoria, setNewCategoria)}
      </ModalComponent>
      <ModalComponent
        title={`Editar Categoría ${selectedCategoria?.id}`}
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditCategoria}
      >
        {renderCategoriaInputs(selectedCategoria, setSelectedCategoria)}
      </ModalComponent>
    </div>
  );
};

const renderCategoriaInputs = (categoria, setCategoria) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label>Nombre:</label>
      <input
        type="text"
        value={categoria?.nombre || ""}
        onChange={(e) => setCategoria((prev) => ({ ...prev, nombre: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Descripción:</label>
      <textarea
        value={categoria?.descripcion || ""}
        onChange={(e) => setCategoria((prev) => ({ ...prev, descripcion: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
  </div>
);

export default GestionCategoriasPage;
