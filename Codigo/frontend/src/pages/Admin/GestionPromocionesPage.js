import React, { useState, useEffect } from "react";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import ConfirmDeleteModal from "../../components/UI/ConfirmDeleteModal";
import { PromocionesService } from "../../api/api.promociones";
import { CategoriasService } from "../../api/api.categorias";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionPromocionesPage = () => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const [newPromocion, setNewPromocion] = useState({
    nombre: "",
    descripcion: "",
    descuento: "",
    fechaInicio: "",
    fechaFin: "",
    categorias: [],
  });

  const [selectedPromocion, setSelectedPromocion] = useState({
    categorias: [], // Se inicializa con un arreglo vacío
  });

  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear}-01-01`;
  const maxDate = `${currentYear}-12-31`;

  const fetchData = async () => {
    try {
      const [promocionesResponse, categoriasResponse] = await Promise.all([
        PromocionesService.getPromociones(),
        CategoriasService.getCategorias(),
      ]);

      // Marcar las categorías asociadas con promociones activas
      const categoriasConPromocionActiva = promocionesResponse.flatMap((promocion) =>
        (promocion.categorias || []).map((categoria) => categoria.id) // 🔥 Evita error si `categorias` es undefined
      );

      // Añadimos un flag `activa` para identificar estas categorías
      const categoriasActualizadas = categoriasResponse.map((categoria) => ({
        ...categoria,
        activa: categoriasConPromocionActiva.includes(categoria.id),
      }));

      setData(promocionesResponse || []);
      setCategorias(categoriasActualizadas || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const clearNewPromocion = () => {
    setNewPromocion({
      nombre: "",
      descripcion: "",
      descuento: "",
      fechaInicio: "",
      fechaFin: "",
      categorias: [],
    });
  };

  const handleAddPromocion = async () => {
    try {
      const formattedCategorias =
      Array.isArray(newPromocion.categorias) && newPromocion.categorias.length > 0
        ? newPromocion.categorias.map((cat) => cat.id)
        : []; 
  
      // Preparar los datos para el envío
      const formattedData = {
        nombre: newPromocion.nombre,
        descripcion: newPromocion.descripcion,
        descuento: parseFloat(newPromocion.descuento) || 0,
        fechaInicio: newPromocion.fechaInicio.split("T")[0] || null,
        fechaFin: newPromocion.fechaFin.split("T")[0] || null,
        categorias: formattedCategorias, // Enviamos un arreglo de IDs
      };
  
      console.log("Datos enviados al backend (ajustados):", formattedData); // Depuración
  
      // Enviar solicitud POST al backend
      const createdPromocion = await PromocionesService.createPromocion(formattedData);
  
      // Actualizar el estado local con la nueva promoción
      setData((prevData) => [...prevData, createdPromocion]);
      toast.success("Promoción añadida correctamente");
      fetchData();
      setIsAddModalOpen(false);
      clearNewPromocion();
    } catch (error) {
      console.error("Error al añadir promoción:", error.response?.data || error.message);
  
      // Mostrar mensajes de error específicos del backend o por validación
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error del servidor: ${error.response.data.error}`);
      } else if (error.message.includes("categorías")) {
        toast.error("Una o más categorías seleccionadas ya están asociadas a otra promoción.");
      } else {
        toast.error("Error al añadir promoción. Revisa los datos ingresados.");
      }
    }
  };
  

  const handleEditPromocion = async () => {
    try {
      if (selectedPromocion) {
        // Aseguramos que `categorias` sea un arreglo de números enteros
        const formattedCategorias =
          Array.isArray(selectedPromocion.categorias) && selectedPromocion.categorias.length > 0
            ? selectedPromocion.categorias.map((cat) =>
                typeof cat === "object" ? cat.id : parseInt(cat)
              )
            : [];
  
        // Preparar datos para el envío al backend
        const updatedPromocionData = {
          nombre: selectedPromocion.nombre,
          descripcion: selectedPromocion.descripcion,
          descuento: parseFloat(selectedPromocion.descuento) || 0,
          fechaInicio: selectedPromocion.fechaInicio || null,
          fechaFin: selectedPromocion.fechaFin || null,
          categorias: formattedCategorias, // Aseguramos que sean solo IDs
        };
  
        console.log("Datos enviados al backend (Update):", updatedPromocionData); // Depuración
  
        // Enviar solicitud PUT al backend
        const updatedPromocion = await PromocionesService.updatePromocion(
          selectedPromocion.id,
          updatedPromocionData
        );
  
        // Actualizar el estado local con los datos actualizados
        setData((prevData) =>
          prevData.map((item) =>
            item.id === updatedPromocion.id ? updatedPromocion : item
          )
        );
  
        setSelectedPromocion(null);
        setIsEditModalOpen(false);
        toast.success("Promoción editada correctamente.");
      }

      // Actualizar datos de la lista
      fetchData();

    } catch (error) {
      console.error("Error al editar promoción:", error.response?.data || error.message);
  
      // Mostrar mensaje de error del backend, si está disponible
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error del servidor: ${error.response.data.error}`);
      } else if (error.message.includes("categorías")) {
        toast.error("No se puede actualizar. Algunas categorías seleccionadas ya están en uso.");
      } else {
        toast.error("Error al editar promoción. Revisa los datos ingresados.");
      }
    }
  };
  

  const handleDeletePromocion = async () => {
    try {
      await PromocionesService.deletePromocion(selectedPromocion.id);
      setData((prevData) => prevData.filter((item) => item.id !== selectedPromocion.id));
      toast.success("Promoción eliminada correctamente.");
      setIsConfirmDeleteModalOpen(false);
      setSelectedPromocion(null);

      // Refrescar datos
      fetchData();
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

  const renderPromocionInputs = (promocion, setPromocion) => {
    if (!promocion) {
      return <div>Cargando...</div>;
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-bold mb-2">Nombre:</label>
          <input
            type="text"
            value={promocion.nombre || ""}
            onChange={(e) => setPromocion((prev) => ({ ...prev, nombre: e.target.value }))}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="font-bold mb-2">Descripción:</label>
          <textarea
            value={promocion.descripcion || ""}
            onChange={(e) => setPromocion((prev) => ({ ...prev, descripcion: e.target.value }))}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="font-bold mb-2">Descuento (%):</label>
          <input
            type="number"
            value={promocion.descuento || ""}
            min="0"
            max="100"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 0 && value <= 100) {
                setPromocion((prev) => ({ ...prev, descuento: e.target.value }));
              } else if (value > 100) {
                setPromocion((prev) => ({ ...prev, descuento: "100" })); // Forzamos límite superior
              } else {
                setPromocion((prev) => ({ ...prev, descuento: "0" })); // Forzamos límite inferior
              }
            }}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="font-bold mb-2">Categorías:</label>
          <div className="grid grid-cols-3 gap-4">
            {categorias.length > 0 ? (
              categorias.map((categoria) => {
                const perteneceAPromocion =
                  selectedPromocion?.categorias.some((rel) => rel.id === categoria.id) || false;

                const asignadaAOtraPromocion = data.some(
                  (promocion) =>
                    promocion.id !== selectedPromocion?.id &&
                    promocion.categorias.some((rel) => rel.id === categoria.id)
                );

                return (
                  <label
                    key={categoria.id}
                    className={`flex items-center space-x-2 p-1 rounded-md ${
                      asignadaAOtraPromocion ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={perteneceAPromocion}
                      disabled={asignadaAOtraPromocion}
                      onChange={(e) => {
                        const newCategorias = e.target.checked
                          ? [...(selectedPromocion.categorias || []), categoria]
                          : (selectedPromocion.categorias || []).filter(
                              (cat) => cat.id !== categoria.id
                            );
                        setSelectedPromocion((prev) => ({
                          ...prev,
                          categorias: newCategorias,
                        }));
                      }}
                    />
                    <span className="text-sm text-gray-800">{categoria.nombre}</span>
                  </label>
                );
              })
            ) : (
              <span>Cargando categorías...</span>
            )}
          </div>
        </div>
        <div>
          <label className="font-bold mb-2">Fecha Inicio:</label>
          <input
            type="date"
            value={
              promocion?.fechaInicio
                ? promocion.fechaInicio.split("T")[0] // Convertir al formato YYYY-MM-DD
                : ""
            }
            min={minDate}
            max={maxDate}
            onChange={(e) =>
              setPromocion((prev) => ({
                ...prev,
                fechaInicio: e.target.value, // Actualizar fechaInicio
              }))
            }
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="font-bold mb-2">Fecha Fin:</label>
          <input
            type="date"
            value={
              promocion?.fechaFin
                ? promocion.fechaFin.split("T")[0] // Convertir al formato YYYY-MM-DD
                : ""
            }
            min={minDate}
            max={maxDate}
            onChange={(e) =>
              setPromocion((prev) => ({
                ...prev,
                fechaFin: e.target.value, // Actualizar fechaFin
              }))
            }
            className="border p-2 rounded w-full"
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Promociones</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Añadir
        </button>
      </div>
      <TableComponent
        columns={[
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "descuento", label: "Descuento (%)" },
          { key: "categorias", label: "Categorías" },
          { key: "fechaInicio", label: "Fecha Inicio" },
          { key: "fechaFin", label: "Fecha Fin" },
          { key: "acciones", label: "Acciones" },
        ]}
        
        data={paginatedData.map((item) => {        
          return {
            ...item,
            descuento: item.descuento ? `${parseFloat(item.descuento).toFixed(2)}%` : "0.00%",
            categorias: item.categorias?.length
              ? item.categorias.map((rel) => rel.nombre || rel.categoria?.nombre).join(", ")
              : "Sin categorías",
            fechaInicio: item.fechaInicio ? item.fechaInicio.split("T")[0] : "-",
            fechaFin: item.fechaFin ? item.fechaFin.split("T")[0] : "-",
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
                  onClick={() => {
                    setSelectedPromocion(item);
                    setIsConfirmDeleteModalOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ),
          };
        })}
        
      />

      <ModalComponent
        title="Añadir Promoción"
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
      <ConfirmDeleteModal
        visible={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleDeletePromocion}
        message="¿Estás seguro de que deseas eliminar esta promoción?"
      />
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

export default GestionPromocionesPage;
