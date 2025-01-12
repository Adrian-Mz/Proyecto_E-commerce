import React, { useState, useEffect } from "react";
import TableComponent from "../components/UI/TableComponent";
import { UsuariosAPI } from "../api/api.usuarios";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionUsuariosPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        // Llama al método correcto del API para obtener usuarios
        const usuariosResponse = await UsuariosAPI.getAllUsuarios();
        setData(usuariosResponse || []);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        toast.error("Error al cargar los usuarios.");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDeleteUsuario = async (id) => {
    try {
      // Llama al API para eliminar un usuario por su ID
      await UsuariosAPI.deleteUsuario(id);
      setData((prevData) => prevData.filter((usuario) => usuario.id !== id));
      toast.success("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar el usuario.");
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
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
          { key: "nombre", label: "Nombre" },
          { key: "apellido", label: "Apellido" },
          { key: "correo", label: "Correo Electrónico" },
          { key: "telefono", label: "Teléfono" },
          { key: "pais", label: "País" },
          { key: "rol", label: "Rol" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((usuario) => ({
          ...usuario,
          rol: usuario.rol?.nombre || "Sin rol", // Maneja la relación del rol si existe
          acciones: (
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteUsuario(usuario.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ),
        }))}
      />
    </div>
  );
};

export default GestionUsuariosPage;
