import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.resolve("src/file_promesas/carts.json");

const router = Router();


// GET todos los carritos
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const carts = JSON.parse(data);
    res.send({ status: "Success", payload: carts });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudieron leer los carritos." });
  }
});


// POST crear un nuevo carrito
router.post("/", async (req, res) => {
  const newCart = {
    id: Math.floor(Math.random() * 1000000) + 1,
    products: [],
  };

  try {
    let carts = [];

    try {
      const fileData = await fs.readFile(FILE_PATH, "utf-8");
      carts = JSON.parse(fileData);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    carts.push(newCart);
    await fs.writeFile(FILE_PATH, JSON.stringify(carts, null, 2));

    res.send({
      status: "Success",
      payload: `Carrito ${newCart.id} creado con éxito!`,
      cart: newCart
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo crear el carrito." });
  }
});


// POST para agregar productos al casrrito creado
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  try {
    // Leer carritos
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const carts = JSON.parse(data);

    // Buscar carrito
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex < 0) {
      return res.status(404).send({ status: "Error", error: "Carrito no encontrado" });
    }

    const cart = carts[cartIndex];

    // Buscar producto dentro del carrito
    const productInCartIndex = cart.products.findIndex(p => p.product === productId);

    if (productInCartIndex < 0) {
      // Producto no está en el carrito, agregarlo con cantidad 1
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      // Producto ya está en el carrito, aumentar cantidad
      cart.products[productInCartIndex].quantity += 1;
    }

    // Guardar cambios en el archivo
    carts[cartIndex] = cart;
    await fs.writeFile(FILE_PATH, JSON.stringify(carts, null, 2));

    res.send({
      status: "Success",
      payload: `Producto ${productId} agregado al carrito ${cartId} con éxito`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo agregar el producto al carrito." });
  }
});



// PUT actualizar carrito por id
router.put("/:cartId", async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const cartUpdate = req.body;

  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const carts = JSON.parse(data);

    const index = carts.findIndex(c => c.id === cartId);
    if (index < 0) {
      return res.status(404).send({ status: "Error", error: "Carrito no encontrado!" });
    }

    cartUpdate.id = cartId;
    carts[index] = cartUpdate;

    await fs.writeFile(FILE_PATH, JSON.stringify(carts, null, 2));

    res.send({
      status: "Success",
      payload: `carrito: ${cartId} - actualizado con éxito!`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo actualizar el carrito." });
  }
});


// DELETE carrito por id
router.delete("/:cartId", async (req, res) => {
  const cartId = parseInt(req.params.cartId);

  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    const carts = JSON.parse(data);
    const newCarts = carts.filter(c => c.id !== cartId);

    if (newCarts.length === carts.length) {
      return res.status(404).send({ status: "Error", message: "Carrito no encontrado!" });
    }

    await fs.writeFile(FILE_PATH, JSON.stringify(newCarts, null, 2));

    res.send({
      status: "Success",
      payload: `carrito: ${cartId} - eliminado con éxito!`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo eliminar el carrito." });
  }
});


export default router;
