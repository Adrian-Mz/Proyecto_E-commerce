import React, { useState } from "react";
import ModalComponent from "./ModalComponent";
import { UsuariosAPI } from "../../api/api.usuarios";
import { toast } from "react-toastify";

const PasswordRecoveryModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecoverPassword = async () => {
    if (!email) {
      toast.error("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      await UsuariosAPI.recoverPassword(email);
      toast.success("Se ha enviado un correo con instrucciones para restablecer tu contraseña.");
      setEmail(""); // Limpiar el input
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al enviar la solicitud de recuperación:", error);
      toast.error("No se pudo procesar tu solicitud. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalComponent
      title="Recuperar Contraseña"
      visible={visible}
      onClose={onClose}
      onSave={handleRecoverPassword}
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>
    </ModalComponent>
  );
};

export default PasswordRecoveryModal;
