import React from "react";
import InputField from "../components/UI/InputField";
import Button from "../components/UI/Button";

const UserProfilePage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Perfil</h2>
      <form className="space-y-4">
        <InputField id="nombre" label="Nombre" type="text" placeholder="Tu nombre" />
        <InputField id="apellido" label="Apellido" type="text" placeholder="Tu apellido" />
        <InputField id="correo" label="Correo electrónico" type="email" placeholder="Tu correo" disabled />
        <InputField id="direccion" label="Dirección" type="text" placeholder="Tu dirección" />
        <InputField id="telefono" label="Teléfono" type="text" placeholder="Tu teléfono" />
        <Button type="submit">Guardar Cambios</Button>
      </form>
    </div>
  );
};

export default UserProfilePage;
