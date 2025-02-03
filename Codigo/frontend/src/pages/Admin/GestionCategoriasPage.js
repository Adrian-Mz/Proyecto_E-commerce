import React, { useState, useEffect } from "react";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import { CategoriasService } from "../../api/api.categorias";
import { FaEdit, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionCategoriasPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNames, setSelectedNames] = useState([]); // Guardará los nombres seleccionados
  const [showDropdown, setShowDropdown] = useState(false); // Controla la visibilidad del dropdown
  const [filters ] = useState({
    nombre: "",
    descripcion: "",
  });

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

  const filteredData = data.filter((categoria) => {
    return (
      (selectedNames.length === 0 || selectedNames.includes(categoria.nombre)) &&
      categoria.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase()) &&
      (searchTerm === "" ||
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded pl-10 w-64 text-gray-700"
          />
          <FaSearch className="absolute left-56 top-3 text-gray-500" />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setIsAddModalOpen(true);
            clearNewCategoria();
          }}
        >
          Añadir
        </button>
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
      <label className="text-sm font-bold text-gray-700">Filtrar por Nombre:</label>
      {/* Filtros individuales */}
      <div className="flex items-center space-x-2">
        {/* Dropdown para seleccionar nombres */}
        <div className="relative">
          <div
            className="border p-2 rounded-md w-72 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-700"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedNames.length > 0
              ? "Filtro por: " + selectedNames.join(", ")
              : "Selecciona categorias"}
          </div>

          {showDropdown && (
            <div className="absolute bg-gray-100 border rounded mt-1 w-72 max-h-48 overflow-y-auto shadow-lg z-10">
              {Array.from(new Set(data.map((categoria) => categoria.nombre))).map((nombre) => (
                <div
                  key={nombre}
                  className="p-2 hover:bg-gray-300 cursor-pointer rounded-md transition-all duration-200 text-gray-700"
                  onClick={() => {
                    if (!selectedNames.includes(nombre)) {
                      setSelectedNames([...selectedNames, nombre]);
                    }
                    setShowDropdown(false);
                  }}
                >
                  {nombre}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* 🔹 Etiquetas seleccionadas (en línea, a la derecha) */}
        <div className="flex flex-wrap gap-2 ml-4">
          {selectedNames.map((name) => (
            <div
              key={name}
              className="flex items-center bg-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-500 transition-all duration-200 text-gray-700"
            >
              {name}
              <button
                className="ml-2 text-white font-bold"
                onClick={() => setSelectedNames(selectedNames.filter((n) => n !== name))}
              >
                ✕
              </button>
            </div>
          ))}
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