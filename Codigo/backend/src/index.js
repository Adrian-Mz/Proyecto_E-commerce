import express from 'express';
import cors from 'cors';
import usuariosRoutes from "./routes/usuarios.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import carritoRoutes from "./routes/carrito.routes.js"
import categoriaRoutes from './routes/categorias.routes.js';
import pedidosRoutes from "./routes/pedidos.routes.js";
import metodopagoRoutes from "./routes/metodo_pago.routes.js";
import metodoenvioRoutes from "./routes/metodo_envio.routes.js";
import estadoPedidos from "./routes/estado.routes.js";
import devolucionesPedidos from "./routes/devoluciones.routes.js";
import promocionesRoutes from "./routes/promociones.routes.js";



const app = express();
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json());

// Agrupación de rutas
app.use("/api/usuarios",usuariosRoutes);
app.use("/api/productos",productosRoutes);
app.use('/api/categorias',categoriaRoutes);
app.use("/api/carrito",carritoRoutes);
app.use("/api/pedidos",pedidosRoutes);
app.use("/api/metodo_pago",metodopagoRoutes);
app.use("/api/metodo_envio",metodoenvioRoutes);
app.use("/api/estado",estadoPedidos);
app.use("/api/devoluciones", devolucionesPedidos);
app.use("/api/promociones",promocionesRoutes);



app.listen(3200, () => {
  console.log('Server is running on port', 3200);
});
