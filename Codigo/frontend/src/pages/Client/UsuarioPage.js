import React, { useEffect, useState } from "react";
import { UsuariosAPI } from "../../api/api.usuarios";
import { toast } from "react-toastify";

const UsuarioPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    direccion: "",
    telefono: "",
    pais: "",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        if (!storedUser || !storedUser.id) {
          throw new Error("Usuario no autenticado.");
        }
  
        const usuarioData = await UsuariosAPI.getUsuarioById(storedUser.id);
        setUsuario(usuarioData);
        setFormData({
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          correo: usuarioData.correo,
          direccion: usuarioData.direccion,
          telefono: usuarioData.telefono,
          pais: usuarioData.pais,
        });
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        toast.error("No tienes permisos para acceder a este recurso.");
      }
    };
  
    fetchUsuario();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = await UsuariosAPI.updateUsuario(usuario.id, formData);
      setUsuario(updatedUser);
      setIsEditing(false);
      toast.success("Datos actualizados correctamente.");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Error al actualizar los datos."
      );
    }
  };

  if (!usuario) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-gray-300">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Apellido:</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Correo:</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              disabled
              className="w-full p-2 rounded bg-gray-700 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">País:</label>
            <input
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsuarioPage;
