import React from "react";

const UserSettingsPage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
      <p className="text-gray-700">
        Aquí puedes gestionar la configuración de tu cuenta. Esta página puede incluir:
      </p>
      <ul className="list-disc ml-6 mt-4 text-gray-700">
        <li>Cambiar la contraseña</li>
        <li>Preferencias de notificaciones</li>
        <li>Opciones de privacidad</li>
      </ul>
    </div>
  );
};

export default UserSettingsPage;
