import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductosService } from "../../api/api.productos";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductosService.getProductos();
    
        // Asegurar que data es un array
        const productosArray = Array.isArray(data) ? data : data.productos || [];
        setProducts(productosArray.slice(0, 6));
    
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-transparent py-16">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center text-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          Productos Destacados
        </motion.h2>

        {loading ? (
          <p className="text-center text-gray-700 text-lg">Cargando productos...</p>
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
            {products.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white w-full p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 flex flex-col items-center text-center"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={product.imagen} // URL de la imagen del producto
                  alt={product.nombre}
                  className="w-48 h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.nombre}</h3>
                <p className="text-blue-600 font-bold text-lg">${product.precio}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
