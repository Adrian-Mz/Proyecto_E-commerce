import { ReporteData } from './reporte.data.js';
import PDFDocument from 'pdfkit';
import stream from 'stream';

export const ReporteService = {
  async generarReporte(req, res) {
    try {
      console.log("Iniciando la generación del reporte...");

      const data = await ReporteData.obtenerDatosReporte();
      console.log("Datos obtenidos correctamente.", data.ingresos);

      // Asegurar valores numéricos para evitar errores con .toFixed()
      const ingresos = {
        brutos: data.ingresos.brutos || 0,
        devoluciones: data.ingresos.devoluciones || 0,
        descuentos: data.ingresos.descuentos || 0,
        iva: data.ingresos.iva || 0,
        netos: data.ingresos.netos || 0,
      };

      // **Crear un Stream en memoria**
      const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
      const pdfStream = new stream.PassThrough();

      // **Configurar las cabeceras para la descarga**
      res.setHeader('Content-Disposition', `attachment; filename=reporte_ventas_${Date.now()}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      
      // **Redirigir el PDF al stream de respuesta**
      doc.pipe(pdfStream);
      pdfStream.pipe(res);

      // **Encabezado del Reporte**
      doc.font('Helvetica-Bold').fontSize(18).text("Reporte de Ventas", { align: "center" });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12).text(`Fecha: ${new Date().toLocaleString()}`);
      doc.moveDown(2);

      // **Resumen General**
      doc.font('Helvetica-Bold').fontSize(14).text("Resumen General", { underline: true });
      doc.moveDown();
      doc.font('Helvetica').fontSize(12);
      doc.text(`Ingresos Brutos: $${ingresos.brutos.toFixed(2)}`);
      doc.text(`Total de Devoluciones: $${ingresos.devoluciones.toFixed(2)}`);
      doc.text(`Total de Descuentos: $${ingresos.descuentos.toFixed(2)}`);
      doc.text(`IVA Descontado (Pago al Estado): $${ingresos.iva.toFixed(2)}`);
      doc.text(`Ingresos Netos: $${ingresos.netos.toFixed(2)}`);
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

      const colWidthsDevoluciones = [80, 130, 250, 200, 80];

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

        const textHeight = doc.heightOfString(nombreProducto, { width: colWidthsDevoluciones[2] });

        if (y + textHeight + 10 > doc.page.height - 50) {
          doc.addPage();
          y = 50;
        }

        doc.text(dev.id.toString(), 50, y);
        doc.text(`${dev.pedido.usuario.nombre} ${dev.pedido.usuario.apellido}`, 150, y);
        doc.text(nombreProducto, 280, y, { width: colWidthsDevoluciones[2] });
        doc.text(motivo, 530, y, { width: colWidthsDevoluciones[3] });
        doc.text(`$${dev.montoReembolsado.toFixed(2)}`, 730, y);

        y += textHeight + 10;
        doc.moveTo(50, y).lineTo(780, y).stroke();
        y += 5;
      });

      doc.end();
      console.log("PDF generado correctamente.");

    } catch (error) {
      console.error("Error generando el reporte:", error);
      res.status(500).json({ error: "Error al generar el reporte PDF." });
    }
  }
};
