import React from "react";
import Logo from "../components/UI/Logo"
import RegisterForm from "../components/UI/RegisterForm";
import AuthLayout from "../components/UI/AuthLayout";

const RegisterPage = () =>{
    return (
        <AuthLayout>
            <Logo
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            alt="Ejemplo-Company"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-100">
                Registrate en nuestra plataforma
            </h2>
            <div className="mt-10">
                <RegisterForm />
            </div>
        </AuthLayout>
    );
}

export default RegisterPage;