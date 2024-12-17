import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-gray-900 text-gray-100 shadow-sm body-font">
      <div className="container flex flex-col md:flex-row items-center justify-between p-6 mx-auto">
        {/* Logo */}
        <a href="/" className="flex items-center mb-4 md:mb-0">
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
        <nav className="flex flex-wrap items-center justify-center text-base space-x-6">
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

        {/* Login */}
        <div className="hidden md:flex items-center">
          <a href="/login" className="hover:text-blue-400 transition">
            Login
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;