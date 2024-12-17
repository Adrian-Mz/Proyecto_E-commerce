import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    try {
      if (storedUser) {
        setUsuario(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al parsear usuario desde localStorage:", error);
      setUsuario(null);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.location.reload();
  };

  return (
    <header className="w-full bg-gray-900 text-gray-100 shadow-sm body-font">
      <div className="container flex flex-col md:flex-row items-center justify-between p-6 mx-auto">
        <a href="/" className="flex items-center mb-4 md:mb-0">
          <span className="text-lg font-bold">Mi E-commerce</span>
        </a>

        <nav className="flex items-center space-x-6">
          <a href="/" className="hover:text-blue-400 transition">
            Inicio
          </a>
          <a href="/productos" className="hover:text-blue-400 transition">
            Productos
          </a>
          <a href="/contacto" className="hover:text-blue-400 transition">
            Contacto
          </a>
        </nav>

        <div className="relative flex items-center space-x-4">
          {usuario ? (
            <div className="relative">
              <button onClick={toggleMenu} className="focus:outline-none">
                <FaUserCircle size={24} className="text-gray-200 hover:text-blue-400" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <span className="block px-4 py-2 text-gray-700">
                    Hola, <strong>{usuario.nombre}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="hover:text-blue-400 transition">
              Login
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
