import React from "react";
import { FaEnvelope } from "react-icons/fa";

const AboutPage = () => {
  return (
    <section className="bg-gray-100">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        {/* Título Principal */}
        <div className="shadow-lg rounded-lg p-6 bg-white mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center">
            ¿Qué es TrendShop?
          </h2>
          <p className="text-lg text-gray-800 mt-4 text-center">
            TrendShop es una plataforma de comercio electrónico y tecnológico 
            diseñada para ofrecer la mejor experiencia de compra en línea. 
            Nuestro objetivo es proporcionar una interfaz intuitiva y una amplia 
            variedad de productos para nuestros clientes.
          </p>
        </div>

        {/* Contenido principal en dos columnas */}
        <div className="grid pt-8 text-left border-t border-gray-300 md:gap-16 dark:border-gray-700 md:grid-cols-2">
          {/* Columna 1: Equipo de Desarrollo */}
          <div className="shadow-lg rounded-lg p-6 bg-white">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">
              Nuestro Equipo de Desarrollo
            </h3>

            <div className="mb-6">
              <h4 className="text-xl font-medium text-gray-800">Adrián Méndez</h4>
              <p className="text-gray-600">Desarrollador Frontend</p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-medium text-gray-800">Kevin Saeteros</h4>
              <p className="text-gray-600">Desarrollador Backend</p>
            </div>

            <p className="text-gray-700">
              Somos estudiantes de la <strong className="text-gray-900">Escuela Superior Politécnica de Chimborazo</strong>, apasionados por el desarrollo de software y la innovación tecnológica.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="shadow-lg rounded-lg p-6 bg-white">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">
              Contáctanos
            </h3>

            <div className="mb-6 flex items-center space-x-4">
              <FaEnvelope className="text-gray-600 w-6 h-6 mb-3" />
              <p className="text-gray-700">luis.mendez@espoch.edu.ec</p>
            </div>

            <div className="mb-6 flex items-center space-x-4">
              <FaEnvelope className="text-gray-600 w-6 h-6 mb-3" />
              <p className="text-gray-700">kevin.saeteros@espoch.edu.ec</p>
            </div>

            <p className="text-gray-700">
              Si tienes alguna pregunta o sugerencia, no dudes en escribirnos. ¡Estamos aquí para ayudarte!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
