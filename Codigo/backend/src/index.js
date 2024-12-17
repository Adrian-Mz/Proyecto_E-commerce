import express from 'express';
import cors from 'cors';
import usuariosRoutes from "./routes/usuarios.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import carritoRoutes from "./routes/carrito.routes.js"
import categoriaRoutes from './routes/categorias.routes.js';
import pedidosRoutes from "./routes/pedidos.routes.js"



const app = express();
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json());

// Agrupación de rutas
app.use("/api/usuarios",usuariosRoutes);
app.use("/api/productos",productosRoutes);
app.use('/api/categorias',categoriaRoutes);
app.use("/api/carrito",carritoRoutes);
app.use("/api/pedidos",pedidosRoutes);


app.listen(3200, () => {
  console.log('Server is running on port', 3200);
});
