import React from "react";

const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-2xl font-bold">E-commerce</div>
                <nav>
                    <a href="/" className="text-gray-700 hover:text-blue-500">
                        Inicio
                    </a>
                    <a href="/products" className="text-gray-700 hover:text-blue-500">
                        Productos
                    </a>
                    <a href="/login" className="text-gray-700 hover:text-blue-500">
                        Login
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header;