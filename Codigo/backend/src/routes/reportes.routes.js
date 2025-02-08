import express from 'express';
import { ventasService } from '../reportes/r.ventas.service.js';
import { productosService } from '../reportes/r.productos.service.js';
import { clientesService } from '../reportes/r.clientes.service.js';
import { pagosService } from '../reportes/r.pagos.service.js';
import { devolucionesService } from '../reportes/r.devoluciones.service.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/roles.middleware.js';

const router = express.Router();

/** 📊 Reportes Generales **/
router.get('/resumen', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const resumen = {
      totalVentas: await ventasService.totalVentas(),
      cantidadPedidos: await ventasService.cantidadPedidos(),
      productosMasVendidos: await productosService.productosMasVendidos(),
      totalClientes: await clientesService.totalClientes(),
      ingresosTotales: await pagosService.ingresosTotales(),
      cantidadDevoluciones: await devolucionesService.cantidadDevoluciones(),
    };
    res.status(200).json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** 📌 Reportes de Ventas **/
router.get('/ventas/total', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const totalVentas = await ventasService.totalVentas();
    res.status(200).json(totalVentas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Cantidad total de pedidos
router.get('/ventas/cantidad', async (req, res) => {
    try {
      const resultado = await ventasService.cantidadPedidos();
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/ventas/metodo-pago', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const ventasMetodoPago = await ventasService.ventasPorMetodoPago();
    res.status(200).json(ventasMetodoPago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ventas/metodo-envio', verificarToken, verificarRol(['Administrador']), async (req, res) => {
  try {
    const ventasMetodoEnvio = await ventasService.ventasPorMetodoEnvio();
    res.status(200).json(ventasMetodoEnvio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Parámetro opcional "agrupacion" con valores: "day", "month" o "year"
router.get('/ventas/ingresos-por-fecha', async (req, res) => {
    const { agrupacion = 'month' } = req.query; // Valor por defecto: mes
    try {
      const resultado = await ventasService.ingresosPorFecha(agrupacion);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// 🔹 Productos
router.get('/productos/mas-vendidos', async (req, res) => {
    try {
      const data = await productosService.productosMasVendidos();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/productos/mayor-ingreso', async (req, res) => {
    try {
      const data = await productosService.productosConMayorIngreso();
      res.json(data);
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
  
  // 🔹 Clientes
  router.get('/clientes/total', async (req, res) => {
    try {
      const data = await clientesService.totalClientes();
      res.json({ totalClientes: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/clientes/con-mas-compras', async (req, res) => {
    try {
      const data = await clientesService.clientesConMasCompras();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/clientes/por-ciudad', async (req, res) => {
    try {
      const data = await clientesService.clientesPorCiudad();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/clientes/nuevos-por-fecha', async (req, res) => {
    try {
      const data = await clientesService.clientesNuevosPorFecha();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  // 🔹 Devoluciones y Cancelaciones
  router.get('/devoluciones/total', async (req, res) => {
    try {
      const data = await devolucionesService.cantidadDevoluciones();
      res.json({ totalDevoluciones: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/devoluciones/motivos-mas-comunes', async (req, res) => {
    try {
      const data = await devolucionesService.motivosDevolucionMasComunes();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/devoluciones/pedidos-cancelados', async (req, res) => {
    try {
      const data = await devolucionesService.pedidosCancelados();
      res.json({ pedidosCancelados: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/devoluciones/tiempo-promedio-resolucion', async (req, res) => {
    try {
      const data = await devolucionesService.tiempoPromedioResolucionDevoluciones();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  // 🔹 Finanzas y Pagos
  router.get('/pagos/ingresos-totales', async (req, res) => {
    try {
      const data = await pagosService.ingresosTotales();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/pagos/por-metodo', async (req, res) => {
    try {
      const data = await pagosService.pagosPorMetodo();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
  router.get('/pagos/comparacion-anual', async (req, res) => {
    try {
      const data = await pagosService.comparacionIngresosAnuales();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;
