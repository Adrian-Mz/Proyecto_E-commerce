import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createServer } from "http";
import { Server } from "socket.io";

import usuariosRoutes from './routes/usuarios.routes.js';
import productosRoutes from './routes/productos.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import categoriaRoutes from './routes/categorias.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import metodopagoRoutes from './routes/metodo_pago.routes.js';
import metodoenvioRoutes from './routes/metodo_envio.routes.js';
import estadoPedidos from './routes/estado.routes.js';
import devolucionesPedidos from './routes/devoluciones.routes.js';
import promocionesRoutes from './routes/promociones.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import ivaRoutes from './routes/iva.routes.js'
import reportRoutes from './reports/reports.routes.js'

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir acceso desde cualquier frontend
  },
});

const connectedClients = new Map(); // 🔹 Almacenar clientes conectados

// Gestión de conexiones WebSocket
io.on("connection", (socket) => {
  //console.log("Cliente conectado:", socket.id);

  // Registrar conexión de usuario
  socket.on("registrarUsuario", (usuarioId) => {
    connectedClients.set(usuarioId, socket);
    //console.log(`Usuario ${usuarioId} registrado en WebSockets`);
  });

  // Manejar desconexión de usuario
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    for (let [key, value] of connectedClients.entries()) {
      if (value === socket) {
        connectedClients.delete(key);
        break;
      }
    }
  });
});

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/metodo_pago', metodopagoRoutes);
app.use('/api/metodo_envio', metodoenvioRoutes);
app.use('/api/estado', estadoPedidos);
app.use('/api/devoluciones', devolucionesPedidos);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/iva', ivaRoutes);
app.use('/api/reportes',reportRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Ocurrió un error inesperado.',
  });
});

// Iniciar servidor
server.listen(3200, () => {
  console.log('Server is running on port', 3200);
});

export { io, connectedClients }; // 🔹 Exportar `connectedClients` para que pueda ser usado en otros archivos
