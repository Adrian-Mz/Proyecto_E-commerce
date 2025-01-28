import { fileURLToPath } from 'url';
import { dirname } from 'path';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generarFacturaPedido(pedidoDetalles, pdfPath) {
  const doc = new PDFDocument({ margin: 50 });

  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // Ruta absoluta del logo
  const logoPath = path.join(__dirname, '..', 'img', 'images.png');

  // Verificar si el logo existe
  if (!fs.existsSync(logoPath)) {
    console.error(`Logo no encontrado en: ${logoPath}`);
    throw new Error('El archivo del logo no existe.');
  }

  // Encabezado: Logo y fecha
  doc.image(logoPath, 50, 45, { width: 100 }) // Asegúrate de tener un logo en tu proyecto
    .fillColor("#444444")
    .fontSize(20)
    .text("Factura de Pedido", 200, 50, { align: "right" })
    .fontSize(10)
    .text(`Fecha: ${new Date().toLocaleDateString()}`, 200, 80, { align: "right" })
    .text(`Número de pedido: #${pedidoDetalles.id}`, 200, 95, { align: "right" })
    .moveDown();

  // Sección de facturación y envío
  doc.fontSize(12)
    .fillColor("#000000")
    .text("Facturación de Facturas", 50, 150)
    .font("Helvetica-Bold")
    .text("Empresa:", 50, 170)
    .font("Helvetica")
    .text("TrendShop", 150, 170)
    .font("Helvetica-Bold")
    .text("Nombre:", 50, 190)
    .font("Helvetica")
    .text(pedidoDetalles.usuario.nombre, 150, 190)
    .font("Helvetica-Bold")
    .text("Dirección:", 50, 210)
    .font("Helvetica")
    .text(pedidoDetalles.direccionEnvio, 150, 210)
    .moveDown();

  doc.fontSize(12)
    .text("Datos de Envío", 350, 150)
    .font("Helvetica-Bold")
    .text("Nombre:", 350, 170)
    .font("Helvetica")
    .text(pedidoDetalles.usuario.nombre, 450, 170)
    .font("Helvetica-Bold")
    .text("Dirección:", 350, 190)
    .font("Helvetica")
    .text(pedidoDetalles.direccionEnvio, 450, 190)
    .moveDown();

  // Tabla de productos
  doc.moveDown();
  doc.font("Helvetica-Bold").text("Descripción", 50, 260)
    .text("Cantidad", 350, 260, { width: 50, align: "right" })
    .text("Precio por unidad", 400, 260, { width: 90, align: "right" })
    .text("Total", 500, 260, { width: 90, align: "right" })
    .moveDown();

  let y = 280;
  pedidoDetalles.productos.forEach((item) => {
    doc.font("Helvetica").text(item.producto.nombre, 50, y)
      .text(item.cantidad, 350, y, { width: 50, align: "right" })
      .text(`$${item.precio_unitario.toFixed(2)}`, 400, y, { width: 90, align: "right" })
      .text(`$${(item.cantidad * item.precio_unitario).toFixed(2)}`, 500, y, { width: 90, align: "right" });
    y += 20;
  });

  // Línea separadora
  doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

  // Total de la factura
  doc.fontSize(14).font("Helvetica-Bold")
    .text(`Total: $${pedidoDetalles.total.toFixed(2)}`, 400, y + 20, { width: 180, align: "right" });

  doc.end();

  // Esperar a que el PDF se genere completamente
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  console.log("Factura generada:", pdfPath);
  }
  