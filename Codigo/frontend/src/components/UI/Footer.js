import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 rounded-lg shadow m-0 ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white no-underline">
              Aphros™
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium">
            <li>
              <a href="/home" className="no-underline me-4 md:me-6">
                Acerca de
              </a>
            </li>
            <li>
              <a href="/home" className="no-underline me-4 md:me-6">
                Politica de Privacidad
              </a>
            </li>
            <li>
              <a href="/home" className="no-underline me-4 md:me-6">
                Licencia
              </a>
            </li>
            <li>
              <a href="/home" className="no-underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm sm:text-center">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Aphros™
          </a>
          . Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
