import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/UI/SideBar';
import GestionProductosPage from './GestionProductosPage';

const AdminPage = () => {
  const funcionalidades = [
    {
      titulo: "Gestión de Productos",
      descripcion: "Visualiza, añade, edita y elimina productos de la tienda.",
      enlace: "/admin/productos",
    },
    {
      titulo: "Gestión de Categorías",
      descripcion: "Organiza las categorías de productos.",
      enlace: "/admin/categorias",
    },
    {
      titulo: "Gestión de Usuarios",
      descripcion: "Administra los usuarios registrados en la plataforma.",
      enlace: "/admin/usuarios",
    },
    {
      titulo: "Gestión de Pedidos",
      descripcion: "Visualiza y actualiza el estado de los pedidos.",
      enlace: "/admin/pedidos",
    },
    {
      titulo: "Gestión de Devoluciones",
      descripcion: "Administra las solicitudes de devolución de productos.",
      enlace: "/admin/devoluciones",
    },
  ];

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
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {/* Mensaje de bienvenida */}
                    <div className="bg-gray-900 text-gray-100 p-6 rounded-md shadow-md mb-6">
                      <h1 className="text-2xl font-bold">Bienvenido al Panel de Administración</h1>
                      <p className="text-gray-300 mt-2">
                        Aquí puedes gestionar todas las funciones de tu tienda. Selecciona una opción para comenzar.
                      </p>
                    </div>

                    {/* Tarjetas de funcionalidades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {funcionalidades.map((func, index) => (
                        <div
                          key={index}
                          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                          <h2 className="text-xl font-bold text-gray-900">{func.titulo}</h2>
                          <p className="text-gray-700 mt-2">{func.descripcion}</p>
                          <a
                            href={func.enlace}
                            className="mt-4 inline-block text-blue-500 hover:text-blue-700"
                          >
                            Ir a {func.titulo} →
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                }
              />
              <Route path="productos" element={<GestionProductosPage />} />
              {/* Agrega más rutas aquí según las funcionalidades */}
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
