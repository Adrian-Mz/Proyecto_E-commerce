import React, { useState } from "react";

const Footer = () => {
  const [isOpen, setIsOpen] = useState({
    about: false,
    privacy: false,
    contact: false,
  });

  const openModal = (modal) => setIsOpen({ ...isOpen, [modal]: true });
  const closeModal = (modal) => setIsOpen({ ...isOpen, [modal]: false });

  return (
    <footer className="bg-gray-900 text-gray-500 shadow m-0">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/home"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse no-underline"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-400">
              TrendShop™
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium">
            <li>
              <button
                onClick={() => openModal("about")}
                className="no-underline me-4 md:me-6 text-gray-400 hover:text-white transition"
              >
                Acerca de
              </button>
            </li>
            <li>
              <button
                onClick={() => openModal("privacy")}
                className="no-underline me-4 md:me-6 text-gray-400 hover:text-white transition"
              >
                Política de Privacidad
              </button>
            </li>
            <li>
              <button
                onClick={() => openModal("contact")}
                className="no-underline text-gray-400 hover:text-white transition"
              >
                Contacto
              </button>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm sm:text-center">
          © 2025{" "}
          <a href="/home" className="no-underline text-gray-400 hover:text-white transition">
            TrendShop™
          </a>
          . Todos los derechos reservados.
        </span>
      </div>

      {/* Modales */}
      {Object.keys(isOpen).map((modal) => (
        isOpen[modal] && (
          <div 
            key={modal} 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => closeModal(modal)}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md" onClick={(e) => e.stopPropagation()}>
              {/* Contenido del modal */}
              {modal === "about" && (
                <>
                  <h2 className="text-xl font-bold text-gray-900">Acerca de TrendShop</h2>
                  <p className="text-gray-700 mt-2">
                    TrendShop es una plataforma de comercio electrónico diseñada para ofrecer la mejor experiencia de compra en línea.
                  </p>
                </>
              )}
              {modal === "privacy" && (
                <>
                  <h2 className="text-xl font-bold text-gray-900">Política de Privacidad</h2>
                  <p className="text-gray-700 mt-2">
                    En TrendShop, nos tomamos tu privacidad en serio. A continuación, te explicamos cómo recopilamos, usamos y protegemos tu información.
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 mt-4">1. Información Recopilada</h3>
                  <p className="text-gray-700">
                    Recopilamos información personal como tu nombre, correo electrónico y datos de compra para mejorar tu experiencia en nuestra tienda.
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 mt-4">2. Uso de la Información</h3>
                  <p className="text-gray-700">
                    Utilizamos tu información para procesar pedidos, mejorar nuestros servicios y personalizar tu experiencia en TrendShop.
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 mt-4">3. Protección de Datos</h3>
                  <p className="text-gray-700">
                    Implementamos medidas de seguridad avanzadas para proteger tu información contra accesos no autorizados.
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 mt-4">4. Contacto</h3>
                  <p className="text-gray-700">
                    Si tienes preguntas sobre nuestra política de privacidad, contáctanos en{" "}
                    <a href="mailto:contacto@trendshop.com" className="text-blue-600 hover:underline">
                      contacto@trendshop.com
                    </a>.
                  </p>
                </>
              )}
              {modal === "contact" && (
                <>
                  <h2 className="text-xl font-bold text-gray-900">Contacto</h2>
                  <p className="text-gray-700 mt-2">Si necesitas ayuda, puedes escribirnos a:</p>
                  <p className="text-gray-800 font-medium mt-2">contacto@trendshop.com</p>
                </>
              )}
              {/* Botón de Cierre */}
              <button
                onClick={() => closeModal(modal)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )
      ))}
    </footer>
  );
};

export default Footer;
