import React, { useState } from "react";
import { UsuariosAPI } from "../../api/api.usuarios";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";

const UserSettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valida la nueva contraseña
  const validateNewPassword = (password) => {
    const requirements = [
      /.{8,}/.test(password), // Al menos 8 caracteres
      /[A-Z]/.test(password), // Al menos una mayúscula
      /[a-z]/.test(password), // Al menos una minúscula
      /\d/.test(password), // Al menos un número
      /[@$!%*?&]/.test(password), // Al menos un carácter especial
    ];
    setIsNewPasswordValid(requirements.every((req) => req));
  };

  // Valida la confirmación de la contraseña
  const validateConfirmPassword = (password) => {
    setIsConfirmPasswordValid(password === newPassword);
  };

  // Cambia la contraseña
  const handlePasswordChange = async () => {
    if (!currentPassword || !isNewPasswordValid || !isConfirmPasswordValid) {
      toast.error("Asegúrate de ingresar todos los datos correctamente.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        passwordActual: currentPassword, // Contraseña actual
        nuevaPassword: newPassword, // Nueva contraseña
      };

      console.log("Actualizando contraseña con /cambiar-password...", payload);
      await UsuariosAPI.cambiarPassword(payload);

      toast.success("Contraseña actualizada exitosamente.");
      resetFields();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error(
        error.response?.data?.error ||
          "No se pudo actualizar la contraseña. Verifica los datos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reinicia los campos y estados
  const resetFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsNewPasswordValid(false);
    setIsConfirmPasswordValid(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Configuración de Contraseña
      </h2>
      <div className="space-y-4">
        {/* Contraseña actual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validateNewPassword(e.target.value);
            }}
            className="w-full p-2 border rounded"
          />
          {isNewPasswordValid && (
            <p className="text-green-500 text-sm mt-2 flex items-center">
              <FaCheck className="mr-1" />
              Contraseña válida.
            </p>
          )}
        </div>

        {/* Confirmar nueva contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(e.target.value);
            }}
            className="w-full p-2 border rounded"
          />
          {isConfirmPasswordValid && (
            <p className="text-green-500 text-sm mt-2 flex items-center">
              <FaCheck className="mr-1" />
              Contraseñas coinciden.
            </p>
          )}
        </div>
      </div>

      {/* Botón para actualizar la contraseña */}
      <button
        onClick={handlePasswordChange}
        disabled={
          !currentPassword ||
          !isNewPasswordValid ||
          !isConfirmPasswordValid ||
          isSubmitting
        }
        className={`w-full bg-blue-500 text-white py-2 mt-6 rounded ${
          currentPassword &&
          isNewPasswordValid &&
          isConfirmPasswordValid &&
          !isSubmitting
            ? "hover:bg-blue-600"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
      </button>
    </div>
  );
};

export default UserSettingsPage;
