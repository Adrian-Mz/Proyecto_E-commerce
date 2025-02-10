import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CategoriasService } from "../../api/api.categorias";
import { FaBox, FaCheckCircle, FaMicrochip, FaLaptop, FaDatabase, FaTv} from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Asignación de íconos por categoría
const categoryIcons = {
  "Gabinetes - Cases": FaBox,
  "Refrigeración - CPU": FaCheckCircle,
  "Procesadores": FaMicrochip,
  "Tarjetas Gráficas": FaLaptop,
  "Discos Duros": FaDatabase,
  "Monitores": FaTv,
};

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoriasService.getCategorias();
        setCategories(data.slice(0, 6)); // Solo mostramos las primeras 6 categorías
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="bg-transparent  py-16">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center text-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          Categorías Destacadas
        </motion.h2>

        {loading ? (
          <p className="text-center text-gray-700 text-lg">Cargando categorías...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
            }}
          >
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.nombre] || FaBox; // Usa el ícono correspondiente o un ícono por defecto
              return (
                <motion.div
                  key={index}
                  className="bg-white w-full p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 flex flex-col items-center text-center"
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="h-16 w-16 mb-4 text-black" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{category.nombre}</h3>
                  <p className="text-gray-600">{category.descripcion}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopCategories;
