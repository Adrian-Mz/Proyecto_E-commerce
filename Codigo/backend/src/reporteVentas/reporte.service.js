import { ReporteData } from './reporte.data.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const ReporteService = {
  async generarReporte(res) {
    try {
      console.log("Iniciando la generación del reporte...");

      // Obtener datos del reporte
      const data = await ReporteData.obtenerDatosReporte();
      console.log("Datos obtenidos correctamente.");

      // Configurar el directorio y archivo
      const reportsDir = path.join(process.cwd(), "src", "rVentas");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const fileName = `reporte_ventas_${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });

      console.log("Creando el documento PDF...");
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // **Encabezado del Reporte**
      doc.font('Helvetica-Bold').fontSize(18).text("Reporte de Ventas", { align: "center" });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12).text(`Fecha: ${new Date().toLocaleString()}`);
      doc.moveDown(2);

      // **Resumen General**
      doc.font('Helvetica-Bold').fontSize(14).text("Resumen General", { underline: true });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12);
      doc.text(`Ingresos Brutos: $${data.ingresos.brutos.toFixed(2)}`);
      doc.text(`Total de Devoluciones: $${data.ingresos.devoluciones.toFixed(2)}`);
      doc.text(`Total Descuentos: $${data.ingresos.descuentos.toFixed(2)}`); // 🔹 Se agrega el total de descuentos
      doc.text(`Total IVA: $${data.ingresos.iva.toFixed(2)}`);
      doc.text(`Ingresos Netos: $${data.ingresos.neto.toFixed(2)}`);
      doc.moveDown(2);

      // **Ventas Realizadas**
      doc.font('Helvetica-Bold').fontSize(14).text("Ventas Realizadas", { underline: true });
      doc.moveDown();

      const marginLeft = 50;
      const colWidths = [80, 130, 250, 80, 80, 100];

      let y = doc.y;
      doc.font('Helvetica-Bold');
      doc.text("ID Pedido", marginLeft, y);
      doc.text("Cliente", marginLeft + colWidths[0], y);
      doc.text("Producto", marginLeft + colWidths[0] + colWidths[1], y);
      doc.text("Cantidad", marginLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
      doc.text("Precio", marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);
      doc.text("Total", marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y);
      doc.moveDown();
      doc.moveTo(marginLeft, doc.y).lineTo(780, doc.y).stroke();
      y = doc.y + 5;

      doc.font('Helvetica');

      console.log("Agregando las ventas al reporte...");
      data.ventas.forEach((venta) => {
        venta.productos.forEach((producto) => {
          const precioBase = parseFloat(producto.producto?.precioBase?.toString() || "0");
          const cantidad = parseInt(producto.cantidad, 10) || 0;
          const totalProducto = cantidad * precioBase;
          const nombreProducto = producto.producto?.nombre || "Producto Desconocido";

          const textHeight = doc.heightOfString(nombreProducto, { width: colWidths[2] });

          if (y + textHeight + 10 > doc.page.height - 50) {
            doc.addPage();
            y = 50;
          }

          doc.text(venta.id.toString(), marginLeft, y);
          doc.text(`${venta.usuario.nombre} ${venta.usuario.apellido}`, marginLeft + colWidths[0], y);
          doc.text(nombreProducto, marginLeft + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
          doc.text(cantidad.toString(), marginLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
          doc.text(`$${precioBase.toFixed(2)}`, marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);
          doc.text(`$${totalProducto.toFixed(2)}`, marginLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { align: "right" });

          y += textHeight + 5;
          doc.moveTo(marginLeft, y).lineTo(780, y).stroke();
          y += 5;
        });
      });

      // **Sección de Devoluciones**
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(14).text("Devoluciones", { underline: true });
      doc.moveDown();
      y = doc.y;

      const colWidthsDevoluciones = [80, 130, 250, 200, 80]; // Se aumentó el ancho de "Producto" y "Motivo"

      doc.text("ID Devolución", 50, y);
      doc.text("Cliente", 150, y);
      doc.text("Producto", 280, y);
      doc.text("Motivo", 530, y);
      doc.text("Monto", 730, y);
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(780, doc.y).stroke();
      y = doc.y + 5;

      console.log("Agregando las devoluciones al reporte...");
      data.devoluciones.forEach((dev) => {
          const nombreProducto = dev.producto?.nombre || "Producto no disponible";
          const motivo = dev.motivo || "Sin motivo";

          // **Calculamos la altura del texto para que no se amontone**
          const textHeight = doc.heightOfString(nombreProducto, { width: colWidthsDevoluciones[2] });

          // **Salto de Página Controlado**
          if (y + textHeight + 10 > doc.page.height - 50) {
              doc.addPage();
              y = 50;
          }

          doc.text(dev.id.toString(), 50, y);
          doc.text(`${dev.pedido.usuario.nombre} ${dev.pedido.usuario.apellido}`, 150, y);
          doc.text(nombreProducto, 280, y, { width: colWidthsDevoluciones[2] });
          doc.text(motivo, 530, y, { width: colWidthsDevoluciones[3] });
          doc.text(`$${dev.montoReembolsado.toFixed(2)}`, 730, y);

          y += textHeight + 10; // Se agregó más espacio entre filas
          doc.moveTo(50, y).lineTo(780, y).stroke();
          y += 5;
      });

      doc.end();
      console.log("PDF generado correctamente.");

      // Enviar el PDF al cliente
      stream.on('finish', () => {
        console.log("Enviando el PDF al cliente...");
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
