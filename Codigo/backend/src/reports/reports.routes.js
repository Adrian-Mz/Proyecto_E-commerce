import express from "express";
import { ReportsService } from "./reports.service.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { verificarRol } from "../middlewares/roles.middleware.js";

const router = express.Router();

// 🔹 Obtener reporte de ventas con filtros dinámicos
router.get("/ventas", verificarToken, verificarRol(["Administrador"]), async (req, res) => {
  try {
    const filtros = req.query;
    const reporte = await ReportsService.getReporteVentas(filtros);
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Obtener un reporte general
router.get("/general", verificarToken, verificarRol(["Administrador"]), async (req, res) => {
  try {
    const filtros = req.query;
    const reporte = await ReportsService.getReporteGeneral(filtros);
    res.json(reporte);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
    "/productos-mas-vendidos",
    verificarToken,
    verificarRol(["Administrador"]),
    async (req, res) => {
      try {
        const filtros = req.query;
        const reporte = await ReportsService.getReporteProductosMasVendidos(filtros);
        res.json(reporte);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  

export default router;
