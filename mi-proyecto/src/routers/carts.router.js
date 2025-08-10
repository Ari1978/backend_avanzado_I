// src/routers/carts.router.js
import { Router } from "express";
import { cartModel } from "../models/cart.model.js";

const router = Router();

// GET todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find().populate("products.product");
    res.send({ status: "Success", payload: carts });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudieron leer los carritos." });
  }
});

// POST crear un nuevo carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({ products: [] });
    res.send({
      status: "Success",
      payload: `Carrito ${newCart._id} creado con éxito!`,
      cart: newCart
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo crear el carrito." });
  }
});

// POST agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });

    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.send({
      status: "Success",
      payload: `Producto ${pid} agregado al carrito ${cid} con éxito`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo agregar el producto al carrito." });
  }
});

// PUT actualizar todo el carrito (lista completa de productos)
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const cart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
    if (!cart) return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });

    res.send({
      status: "Success",
      payload: `Carrito ${cid} actualizado con éxito`,
      cart,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo actualizar el carrito." });
  }
});

// DELETE eliminar carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartModel.findByIdAndDelete(cid);
    if (!result) {
      return res.status(404).send({ status: "Error", message: "Carrito no encontrado!" });
    }

    res.send({
      status: "Success",
      payload: `Carrito ${cid} eliminado con éxito!`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo eliminar el carrito." });
  }
});

// DELETE un producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();

    res.send({
      status: "Success",
      payload: `Producto ${pid} eliminado del carrito ${cid}`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo eliminar el producto del carrito." });
  }
});

// DELETE vaciar todos los productos del carrito
router.delete("/:cid/products", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });

    cart.products = []; // vaciar el array
    await cart.save();

    res.send({
      status: "Success",
      payload: `Todos los productos del carrito ${cid} han sido eliminados.`,
    });
  } catch (err) {
    res.status(500).send({ status: "Error", message: "No se pudo vaciar el carrito." });
  }
});


export default router;
