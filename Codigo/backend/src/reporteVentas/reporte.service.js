import { ReporteData } from './reporte.data.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const ReporteService = {
  async generarReporte(res) {
    try {
      console.log("Iniciando la generación del reporte...");
      const data = await ReporteData.obtenerDatosReporte();
      console.log("Datos obtenidos correctamente");

      // Verificar que los ingresos tengan valores numéricos válidos
      const ingresosBrutos = !isNaN(data.ingresos?.brutos) ? parseFloat(data.ingresos.brutos).toFixed(2) : "0.00";

      // Crear la carpeta "rVentas" si no existe
      const reportsDir = path.join(process.cwd(), "src", "rVentas");
      if (!fs.existsSync(reportsDir)) {
        console.log("Creando directorio rVentas...");
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Definir la ruta donde se guardará el archivo PDF
      const fileName = `reporte_ventas_${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      const doc = new PDFDocument({ margin: 40 });

      // Crear flujo de escritura en archivo
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Encabezado del reporte
      doc.font('Helvetica-Bold').fontSize(18).text("Reporte de Ventas y Devoluciones", { align: "center" });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12).text(`Fecha: ${new Date().toLocaleString()}`);
      doc.moveDown(2);

      // Sección de Resumen General
      doc.font('Helvetica-Bold').fontSize(14).text("Resumen General", { underline: true });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12);
      doc.text(`Ingresos Brutos: $${ingresosBrutos}`);
      doc.moveDown(2);

      // Sección de Ventas Realizadas
      doc.font('Helvetica-Bold').fontSize(14).text("Ventas Realizadas", { underline: true });
      doc.moveDown();

      // Configuración de la tabla
      const tableTop = doc.y;
      const marginLeft = 50;
      const columnWidths = [70, 120, 220, 60, 70, 80]; // Ancho de cada columna

      // Encabezados de la tabla
      doc.font('Helvetica-Bold').text("ID Pedido", marginLeft, tableTop);
      doc.text("Cliente", marginLeft + columnWidths[0], tableTop);
      doc.text("Producto", marginLeft + columnWidths[0] + columnWidths[1], tableTop);
      doc.text("Cantidad", marginLeft + columnWidths[0] + columnWidths[1] + columnWidths[2], tableTop);
      doc.text("Precio", marginLeft + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], tableTop);
      doc.text("Total", marginLeft + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], tableTop);
      doc.moveDown();

      doc.moveTo(marginLeft, doc.y).lineTo(550, doc.y).stroke(); // Línea separadora

      // Filas de la tabla
      let totalGeneral = 0;
      data.ventas.forEach((venta) => {
        venta.productos.forEach((producto) => {
          const y = doc.y + 5;

          // Verificar que los valores numéricos existen y son válidos
          const cantidad = producto.cantidad ?? 0;
          const precioBase = !isNaN(producto.precioBase) ? parseFloat(producto.precioBase).toFixed(2) : "0.00";
          const totalProducto = !isNaN(producto.precioBase) ? (producto.precioBase * cantidad).toFixed(2) : "0.00";

          doc.font('Helvetica').text(`${venta.id}`, marginLeft, y);
          doc.text(`${venta.usuario.nombre} ${venta.usuario.apellido}`, marginLeft + columnWidths[0], y);
          doc.text(`${producto.nombre || "Producto Desconocido"}`, marginLeft + columnWidths[0] + columnWidths[1], y, { width: columnWidths[2] });
          doc.text(`${cantidad}`, marginLeft + columnWidths[0] + columnWidths[1] + columnWidths[2], y);
          doc.text(`$${precioBase}`, marginLeft + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], y);
          doc.text(`$${totalProducto}`, marginLeft + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], y);

          totalGeneral += parseFloat(totalProducto);
          doc.moveDown();

          doc.moveTo(marginLeft, doc.y).lineTo(550, doc.y).stroke(); // Línea separadora
        });
      });

      // Agregar totales generales al final del reporte
      doc.moveDown(2);
      doc.font('Helvetica-Bold').fontSize(14).text("Totales Generales", { underline: true });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12);
      doc.text(`Total de Ventas: $${totalGeneral.toFixed(2)}`);
      doc.text(`Total de Pedidos: ${data.ventas.length}`);
      doc.text(`Total de Productos Vendidos: ${data.ventas.reduce((acc, venta) => acc + venta.productos.length, 0)}`);

      // Finalizar documento
      doc.end();
      console.log("PDF generado correctamente.");

      // Enviar el PDF como respuesta
      stream.on('finish', () => {
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.error("Error al enviar el archivo:", err);
            res.status(500).json({ error: "Error al enviar el reporte PDF." });
          }
        });
      });

    } catch (error) {
      console.error("Error generando el reporte:", error);
      res.status(500).json({ error: "Error al generar el reporte PDF." });
    }
  }
};
