import React, { useState } from "react";
import TableComponent from "../components/UI/TableComponent";
import ModalComponent from "../components/UI/ModalComponent";

const GestionProductosPage = () => {
  const [data, setData] = useState([
    { id: 1, nombre: "Producto 1", categoria: "Categoría A", precio: "$10" },
    { id: 2, nombre: "Producto 2", categoria: "Categoría B", precio: "$20" },
  ]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "categoria", label: "Categoría" },
    { key: "precio", label: "Precio" },
    { key: "acciones", label: "Acciones" },
  ];

  const handleSave = () => {
    console.log("Datos guardados");
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    console.log(`Producto con ID ${id} eliminado`);
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Gestión de Productos
      </h1>
      <p className="mb-6 text-gray-700">
        Bienvenido, administrador. Aquí puedes gestionar los productos:
        ver, añadir, editar o eliminar productos.
      </p>
      <div className="flex justify-between items-center mb-4">
        <ModalComponent title="Añadir Producto" onSave={handleSave}>
          <p>Formulario para añadir un nuevo producto</p>
        </ModalComponent>
      </div>
      <TableComponent
        columns={columns}
        data={data.map((item) => ({
          ...item,
          acciones: (
            <div className="space-x-2">
              <ModalComponent title={`Editar Producto ${item.id}`} onSave={() => console.log("Editado")}>
                <p>Formulario para editar el producto</p>
              </ModalComponent>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          ),
        }))}
      />
    </div>
  );
};

export default GestionProductosPage;
