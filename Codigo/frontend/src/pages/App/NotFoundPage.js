import React from "react";
import NotFoundImage from "../../assets/NotFound.svg"; // Asegúrate de que la ruta sea correcta

const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 bg-white">
      {/* Contenedor de texto */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider text-gray-800">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700 mt-4">
          Página no encontrada
        </h2>
        <p className="text-lg md:text-xl text-gray-600 my-6">
          Lo sentimos, la página que buscas no está disponible.
        </p>
        <a
          href="/home"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-150 no-underline"
          title="Volver al inicio"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>Volver al inicio</span>
        </a>
      </div>

      {/* Contenedor de la imagen ilustrativa */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <img
          src={NotFoundImage}
          alt="Página no encontrada"
          className="w-full max-w-sm lg:max-w-md"
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
