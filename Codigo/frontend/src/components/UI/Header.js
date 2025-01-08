import React, { useState, useEffect } from "react";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import CartSidebar from "./CartSidebar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.location.reload();
  };

  return (
    <header className="w-full bg-gray-900 text-gray-100 shadow-sm z-50 relative">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/home" className="flex items-center mb-4 md:mb-0">
          <svg
            className="w-auto h-5 text-gray-100 fill-current"
            viewBox="0 0 202 69"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M57.44.672s6.656 1.872 6.656 5.72c0 0-1.56 2.6-3.744 6.552 8.424 1.248 16.744 1.248 23.816-1.976-1.352 7.904-12.688 8.008-26.208 6.136-7.696 13.624-19.656 36.192-19.656 42.848 0 .416.208.624.52.624 4.576 0 17.888-14.352 21.112-18.824 1.144-1.456 4.264.728 3.12 2.392C56.608 53.088 42.152 69 36.432 69c-4.472 0-8.216-5.928-8.216-10.4 0-6.552 11.752-28.08 20.28-42.952-9.984-1.664-20.176-3.64-27.976-3.848-13.936 0-16.64 3.536-17.576 6.032-.104.312-.52.52-.832.312-3.744-7.072-1.456-14.56 14.144-14.56 9.36 0 22.048 4.576 34.944 7.592C54.736 5.04 57.44.672 57.44.672z"
              fillRule="nonzero"
            />
          </svg>
        </a>

        {/* Navegación */}
        <div className="flex-1 flex items-center justify-center space-x-8">
          <nav className="flex space-x-6">
            <a
              href="/home"
              className="text-gray-100 hover:text-blue-400 transition no-underline"
            >
              Inicio
            </a>
            <a
              href="/productos"
              className="text-gray-100 hover:text-blue-400 transition no-underline"
            >
              Productos
            </a>
            <a
              href="/contacto"
              className="text-gray-100 hover:text-blue-400 transition no-underline"
            >
              Contacto
            </a>
            <a
              href="/nosotros"
              className="text-gray-100 hover:text-blue-400 transition no-underline"
            >
              Nosotros
            </a>
          </nav>
        </div>

        {/* Botones de login/registro y carrito */}
        <div className="flex items-center space-x-6">
          {/* Barra de búsqueda */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-72 p-2 rounded-md border text-gray-900 focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-500" />
          </div>

          {/* Botones de login/registro */}
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
                    href="/dashboard"
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

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </header>
  );
};

export default Header;
