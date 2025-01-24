const express = require("express");
const prisma = require("../utils/prisma"); // Si usas Prisma
const openai = require("../utils/openai");
const router = express.Router();

router.post("/compare-products", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "El ID del producto es obligatorio." });
  }

  try {
    // Obtener el producto base de la base de datos
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }, // Incluir la categoría del producto
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Obtener todos los productos de la misma categoría
    const productsList = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId, // Filtrar por la misma categoría
        NOT: { id: productId }, // Excluir el producto actual
      },
    });

    if (productsList.length === 0) {
      return res.status(404).json({ error: "No hay productos en la misma categoría para comparar." });
    }

    // Preparar datos para OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Comparar el producto "${product.name}" con la siguiente lista de productos en términos de precio, calidad y características: ${JSON.stringify(
        productsList
      )}. Proporcione una respuesta clara y concisa.`,
      max_tokens: 300,
    });

    res.json({ result: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

module.exports = router;
