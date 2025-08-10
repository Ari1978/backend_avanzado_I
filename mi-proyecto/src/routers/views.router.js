import express from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { loadProducts } from "../productsManager.js"; // Ruta para cargar productos reales

const router = express.Router();

router.get("/home", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const result = await productModel.paginate({}, {
      page,
      limit,
      lean: true,
    });

    res.render("home", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
      totalPages: result.totalPages,
      limit: limit
    });

  } catch (error) {
    console.error("Error al cargar productos con paginación:", error);
    res.status(500).send("Error al cargar productos");
  }
});


router.get("/realtimeproducts", async (req, res) => {
  const products = await loadProducts();
  res.render("realTimeProducts", { products });
});

router.get("/socket", (req, res) => {
  res.render("socket");
});

router.get("/chat", (req, res) => {
  res.render("messages");
});

router.get("/carts", async (req, res) => {
    const carts = await cartModel.find().populate("products.product").lean();
    res.render("carts", { carts });
  
});


export default router;
