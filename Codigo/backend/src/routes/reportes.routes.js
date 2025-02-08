import express from 'express';
import { ventasService } from '../reportes/r.ventas.service.js';
import { productosService } from '../reportes/r.productos.service.js';
import { clientesService } from '../reportes/r.clientes.service.js';
import { pagosService } from '../reportes/r.pagos.service.js';
import { devolucionesService } from '../reportes/r.devoluciones.service.js';
import {reportesService} from '../reportes/reportes.service.js'
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';

const router = express.Router();

/** 📊 Reportes Generales */
router.get('/resumen', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const resumen = await reportesService.obtenerResumenGeneral();
    res.status(200).json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*************************************************** Reportes de Ventas ******************************************************************/

// 🔹 Obtener total de ventas con filtros dinámicos
router.get('/ventas/total', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estadoId } = req.query;
    const resultado = await ventasService.totalVentas({ fechaInicio, fechaFin, estadoId });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener cantidad de pedidos con filtros
router.get('/ventas/cantidad-pedidos', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estadoId } = req.query;
    const resultado = await ventasService.cantidadPedidos({ fechaInicio, fechaFin, estadoId });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener ventas por método de pago con filtros
router.get('/ventas/por-metodo-pago', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estadoId } = req.query;
    const resultado = await ventasService.ventasPorMetodoPago({ fechaInicio, fechaFin, estadoId });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener ventas por método de envío con filtros
router.get('/ventas/por-metodo-envio', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estadoId } = req.query;
    const resultado = await ventasService.ventasPorMetodoEnvio({ fechaInicio, fechaFin, estadoId });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener ingresos agrupados por fecha con filtros
router.get('/ventas/ingresos-por-fecha', async (req, res) => {
  try {
    const { agrupacion, fechaInicio, fechaFin, estadoId } = req.query;
    const resultado = await ventasService.ingresosPorFecha({ agrupacion, fechaInicio, fechaFin, estadoId });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*************************************************** Reportes de Productos ******************************************************************/

// Productos más vendidos con filtros
router.get('/productos/mas-vendidos', async (req, res) => {
  try {
    const { limit, categoriaId, fechaInicio, fechaFin } = req.query;
    const resultado = await productosService.productosMasVendidos({ limit, categoriaId, fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Productos con mayor ingreso con filtros
router.get('/productos/mayor-ingreso', async (req, res) => {
  try {
    const { limit, categoriaId, fechaInicio, fechaFin } = req.query;
    const resultado = await productosService.productosConMayorIngreso({ limit, categoriaId, fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
  router.get('/productos/categorias-mas-vendidas', async (req, res) => {
    try {
      const data = await productosService.categoriasMasVendidas();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/productos/stock-bajo', async (req, res) => {
    try {
      const data = await productosService.productosStockBajo();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// *************************************** Clientes *********************************************************** //

// 🔹 Obtener total de clientes con opción de filtrar por ciudad
router.get('/clientes/total', async (req, res) => {
  try {
    const { ciudad } = req.query;
    const resultado = await clientesService.totalClientes({ ciudad });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Clientes con más compras (con filtros opcionales)
router.get('/clientes/con-mas-compras', async (req, res) => {
  try {
    const { ciudad, limit } = req.query;
    const resultado = await clientesService.clientesConMasCompras({ ciudad, limit });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Clientes agrupados por ciudad
router.get('/clientes/por-ciudad', async (req, res) => {
  try {
    const resultado = await clientesService.clientesPorCiudad();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Nuevos clientes por día/mes/año con filtro de fechas
router.get('/clientes/nuevos', async (req, res) => {
  try {
    const { agrupacion, fechaInicio, fechaFin } = req.query;
    const resultado = await clientesService.clientesNuevosPorFecha({ agrupacion, fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
// ************************************************************** Devoluciones y Cancelaciones ************************************** //

// 🔹 Obtener la cantidad total de devoluciones con filtro de fecha opcional
router.get('/devoluciones/total', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await devolucionesService.cantidadDevoluciones({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener motivos de devolución más comunes con filtro de fecha opcional
router.get('/devoluciones/motivos-comunes', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await devolucionesService.motivosDevolucionMasComunes({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener cantidad de pedidos cancelados con filtro de fecha opcional
router.get('/devoluciones/pedidos-cancelados', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await devolucionesService.pedidosCancelados({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener el tiempo promedio de resolución de devoluciones con filtro de fecha opcional
router.get('/devoluciones/tiempo-promedio-resolucion', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await devolucionesService.tiempoPromedioResolucionDevoluciones({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  
// **************************************************** Finanzas y Pagos ********************************************************* //

// 🔹 Obtener ingresos totales con filtro opcional de fecha
router.get('/pagos/ingresos-totales', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await pagosService.ingresosTotales({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener pagos por método con filtro opcional de fecha
router.get('/pagos/por-metodo', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await pagosService.pagosPorMetodo({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener comparación de ingresos anuales con filtro opcional de fecha
router.get('/pagos/comparacion-anual', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await pagosService.comparacionIngresosAnuales({ fechaInicio, fechaFin });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
