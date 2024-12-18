import React from "react";
import LoginForm from "../components/UI/LoginForm";
import loginImg from "../assets/login.jpg";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sección Izquierda - Imagen */}
      <div className="hidden lg:flex items-center justify-center w-1/2">
        <div
          className="w-3/4 h-3/4 rounded-3xl overflow-hidden opacity-90 shadow-lg"
          style={{
            backgroundImage: `url(${loginImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* Sección Derecha - Formulario con Border Radius */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt="Logo Empresa"
              className="h-10"
            />
          </div>

          {/* Título */}
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-100">
            Inicia sesión en tu cuenta
          </h2>

          {/* Formulario */}
          <div className="mt-8">
            <LoginForm />
          </div>

          {/* Texto de registro */}
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Sin cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
