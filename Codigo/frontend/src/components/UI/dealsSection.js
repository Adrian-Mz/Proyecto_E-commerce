import React from "react";
import CategoryCard from "./categoryCard";
import {FaLaptop, FaGamepad, FaTabletAlt, FaTshirt, FaClock, FaHeadphones} from "react-icons/fa";

const DealsSection = () => {
    return(
        <section className="bg-gray-900 text-gray-100 py-12">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Left Section */}
                <div className="mb-8 lg:mb-0 lg:w-1/2">
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        No te pierdas nuestras <br /> ofertas exclusivas!.
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Descbloquea ahora tus ventajas exclusivas, registrate y <br /> obtén todas las promociones.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                        Compra ahora
                        </button>
                        <button className="bg-gray-700 text-gray-200 px-6 py-2 rounded-md hover:bg-gray-600 transition">
                        Mas →
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="grid grid-cols-2 gap-4 lg:gap-6 lg:w-1/2">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Categorias</h3>
                        <div className="grid grid-cols-2 gap-4">
                        <CategoryCard title="Computers" icon={FaLaptop} hoverColor="blue-400" />
                        <CategoryCard title="Gaming" icon={FaGamepad} hoverColor="purple-400" />
                        <CategoryCard title="Tablets" icon={FaTabletAlt} hoverColor="green-400" />
                        <CategoryCard title="Fashion" icon={FaTshirt} hoverColor="pink-400" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Electronicos</h3>
                        <div className="grid grid-cols-2 gap-4">
                        <CategoryCard title="Laptops" icon={FaLaptop} hoverColor="blue-400" />
                        <CategoryCard title="Watches" icon={FaClock} hoverColor="yellow-400" />
                        <CategoryCard title="Tablets" icon={FaTabletAlt} hoverColor="green-400" />
                        <CategoryCard title="Accessories" icon={FaHeadphones} hoverColor="red-400" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DealsSection;