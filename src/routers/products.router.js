import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.resolve("src/file_promesas/products.json");

const router = Router();

let products = [];

// Función para generar un ID único
function generateUniqueId() {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000) + 1;
  } while (products.some((p) => p.id === newId));
  return newId;
}

// GET todos los productos
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const products = JSON.parse(data);
    res.send({ status: "Success", payload: products });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudieron leer los productos." });
  }
});

//Get productos por ID
router.get("/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const products = JSON.parse(data);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).send({ status: "Error", error: "Producto no encontrado" });
    }

    res.send({ status: "Success", payload: product });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo leer el archivo." });
  }
});

// POST crear un nuevo producto
router.post("/", async (req, res) => {
  let product = req.body;

  if (!product || Object.keys(product).length === 0) {
    return res.status(400).send({ status: "Error", message: "Cuerpo vacío" });
  }

  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = [],
  } = product;

  if (
    !title ||
    !description ||
    !code ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).send({
      status: "Error",
      message:
        "Faltan campos obligatorios. title, description, code, price, stock y category son requeridos.",
    });
  }

  if (
    typeof price !== "number" ||
    typeof stock !== "number" ||
    (thumbnails && !Array.isArray(thumbnails))
  ) {
    return res.status(400).send({
      status: "Error",
      message:
        "price y stock deben ser números. thumbnails debe ser un array si se envía.",
    });
  }

  // Leer archivo actual
  let existingProducts = [];
  try {
    const fileData = await fs.readFile(FILE_PATH, "utf-8");
    existingProducts = JSON.parse(fileData);
  } catch (err) {
    if (err.code !== "ENOENT") {
      return res.status(500).send({ status: "Error", message: "Error al leer archivo" });
    }
    // Si el archivo no existe, se arranca con lista vacía
    existingProducts = [];
  }

  // Generar ID único que no se repita
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000) + 1;
  } while (existingProducts.some((p) => p.id === newId));
  product.id = newId;

  // Asegurar campos bien formados
  product.status = true;
  product.title = title;
  product.description = description;
  product.code = code;
  product.price = price;
  product.stock = stock;
  product.category = category;
  product.thumbnails = thumbnails;

  // Guardar en archivo y memoria
  existingProducts.push(product);
  products.push(product);

  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(existingProducts, null, 2));
  } catch (err) {
    return res.status(500).send({ status: "Error", message: "No se pudo guardar el producto" });
  }

  res.send({
    status: "Success",
    payload: `producto: ${product.id} - creado con éxito y guardado en archivo!`,
  });
});



// PUT actualizar producto por id
router.put("/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const updateData = req.body;

  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const products = JSON.parse(data);

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex < 0) {
      return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
    }

    updateData.id = productId; // mantener el ID original
    products[productIndex] = updateData;

    await fs.writeFile(FILE_PATH, JSON.stringify(products, null, 2));

    res.send({
      status: "Success",
      payload: `producto: ${productId} - actualizado con éxito!`
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo actualizar el producto." });
  }
});


// DELETE producto por id
router.delete("/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    let products = JSON.parse(data);

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex < 0) {
      return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
    }

    products.splice(productIndex, 1);

    await fs.writeFile(FILE_PATH, JSON.stringify(products, null, 2));

    res.send({
      status: "Success",
      payload: `producto: ${productId} - eliminado con éxito!`
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo eliminar el producto." });
  }
});
export default router;


