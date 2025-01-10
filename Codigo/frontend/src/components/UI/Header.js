import React, { useState, useEffect } from "react";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import CartSidebar from "./CartSidebar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsuario(decoded);
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.reload();
  };

  return (
    <header className="w-full bg-gray-900 text-gray-100 shadow-sm z-50 relative">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="/home" className="flex items-center mb-4 md:mb-0">
          <svg
            className="w-auto h-5 text-gray-100 fill-current"
            viewBox="0 0 202 69"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG Path */}
          </svg>
        </a>

        <div className="flex-1 flex items-center justify-center space-x-8">
          <nav className="flex space-x-6">
            <a
              href="/home"
              className="text-gray-100 hover:text-blue-400 transition no-underline"
            >
              Inicio
            </a>
            {usuario?.rol === "Administrador" && (
              <a
                href="/admin"
                className="text-gray-100 hover:text-blue-400 transition no-underline"
              >
                Panel Admin
              </a>
            )}
            <a
              href="/productos"
              className="text-gray-100 hover:text-blue-400 transition no-underline"
            >
              Productos
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-72 p-2 rounded-md border text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-500" />
          </div>

          {usuario ? (
            <div className="relative">
              <button onClick={toggleMenu} className="focus:outline-none">
                <FaUserCircle
                  size={24}
                  className="text-gray-200 hover:text-blue-400"
                />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <span className="block px-4 py-2 text-gray-700">
                    Hola, <strong>{usuario.nombre}</strong>
                  </span>
                  <a
                    href={usuario.rol === "Administrador" ? "/admin" : "/dashboard"}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
                  >
                    Configuración
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="text-gray-100 hover:text-blue-400 transition"
            >
              Login
            </a>
          )}

          <button onClick={toggleCart} className="hover:text-blue-300">
            <FaShoppingCart size={24} />
          </button>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Header;
