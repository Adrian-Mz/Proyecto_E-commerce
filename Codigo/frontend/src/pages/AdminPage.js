import React from 'react';
import Sidebar from '../components/UI/SideBar';
import TableComponent from '../components/UI/TableComponent';
import ModalComponent from '../components/UI/ModalComponent';

const AdminPage = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precio', label: 'Precio' },
  ];

  const data = [
    { id: 1, nombre: 'Producto 1', categoria: 'Categoría A', precio: '$10' },
    { id: 2, nombre: 'Producto 2', categoria: 'Categoría B', precio: '$20' },
  ];

  const handleSave = () => {
    console.log('Datos guardados');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">
        {/* Sidebar y contenido principal */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          {/* Contenido principal */}
          <main className="flex-1 p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl text-gray-900 font-bold">Gestión de Productos</h1>
              <ModalComponent title="Añadir Producto" onSave={handleSave}>
                <p>Formulario de ejemplo</p>
              </ModalComponent>
            </div>
            <TableComponent columns={columns} data={data} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
