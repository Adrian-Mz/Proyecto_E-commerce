import React, { useState, useEffect } from "react";
import TableComponent from "../components/UI/TableComponent";
import ModalComponent from "../components/UI/ModalComponent";
import ConfirmDeleteModal from "../components/UI/ConfirmDeleteModal";
import { UsuariosAPI } from "../api/api.usuarios";
import { RolesAPI } from "../api/api.roles";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionUsuariosPage = () => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsuariosAndRoles = async () => {
      try {
        const usuariosResponse = await UsuariosAPI.getAllUsuarios();
        const rolesResponse = await RolesAPI.getAllRoles();

        setData(usuariosResponse || []);
        setRoles(rolesResponse || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar usuarios o roles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuariosAndRoles();
  }, []);

  const handleDeleteUsuario = async () => {
    try {
      if (userToDelete) {
        await UsuariosAPI.deleteUsuario(userToDelete.id);
        setData((prevData) => prevData.filter((usuario) => usuario.id !== userToDelete.id));
        toast.success("Usuario eliminado correctamente.");
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar el usuario.");
    }
  };

  const handleOpenDeleteModal = (usuario) => {
    setUserToDelete(usuario);
    setIsDeleteModalOpen(true);
  };

  const handleOpenAssignModal = (usuario) => {
    setSelectedUser(usuario);
    setSelectedRole(usuario.rol?.id || "");
    setIsAssignModalOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedRole) {
      toast.error("Por favor, selecciona un rol.");
      return;
    }

    try {
      await RolesAPI.assignRoleToUser(selectedUser.id, parseInt(selectedRole, 10));
      setData((prevData) =>
        prevData.map((usuario) =>
          usuario.id === selectedUser.id
            ? { ...usuario, rol: roles.find((rol) => rol.id === parseInt(selectedRole, 10)) }
            : usuario
        )
      );
      toast.success("Rol asignado correctamente.");
      setIsAssignModalOpen(false);
      setSelectedUser(null);
      setSelectedRole("");
    } catch (error) {
      console.error("Error al asignar rol:", error);
      toast.error("Error al asignar el rol.");
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
          rol: usuario.rol ? usuario.rol.nombre : "Sin rol",
          acciones: (
            <div className="flex space-x-2">
              {/* Mostrar solo editar si es Administrador */}
              {usuario.rol && usuario.rol.nombre === "Administrador" && (
                <button
                  onClick={() => handleOpenAssignModal(usuario)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit size={16} />
                </button>
              )}
              {/* Mostrar editar y eliminar si es Cliente */}
              {usuario.rol && usuario.rol.nombre === "Cliente" && (
                <>
                  <button
                    onClick={() => handleOpenAssignModal(usuario)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(usuario)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={16} />
                  </button>
                </>
              )}
            </div>
          ),
        }))}
      />
      <ModalComponent
        title={`Asignar Rol a ${selectedUser?.nombre || "Usuario"}`}
        visible={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSave={handleAssignRole}
      >
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
            Seleccionar Rol
          </label>
          <select
            id="rol"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
      </ModalComponent>
      <ConfirmDeleteModal
        visible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUsuario}
        message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.nombre}"?`}
      />
    </div>
  );
};

export default GestionUsuariosPage;
