import React from "react";
import Logo from "../components/UI/Logo"
import RegisterForm from "../components/UI/RegisterForm";
import AuthLayout from "../components/UI/AuthLayout";
import RegisterImg from "../assets/register.jpg";

const RegisterPage = () =>{
    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* Sección Izquierda: Imagen */}
            <div className="hidden lg:flex items-center justify-center w-1/2">
                <div
                className="w-4/5 h-4/5 rounded-3xl overflow-hidden opacity-90 shadow-lg"
                style={{
                    backgroundImage: `url(${RegisterImg})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
                ></div>
            </div>

            {/* Sección Derecha: AuthLayout */}
            <div className="flex items-center justify-center w-full lg:w-1/2">
                <AuthLayout>
                <div className="max-w-3xl w-full p-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo
                            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Ejemplo-Company"
                        />
                    </div>

                    {/* Título */}
                    <h2 className="text-center text-2xl font-bold tracking-tight text-gray-100">
                    Regístrate en nuestra plataforma
                    </h2>

                    {/* Formulario */}
                    <div className="mt-8">
                        <RegisterForm />
                    </div>
                </div>
                </AuthLayout>
            </div>
        </div>
    );
}

export default RegisterPage;