import { Router } from "express";
import { productModel } from "../models/product.model.js";

const router = Router();

// GET - Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await productModel.find();
        res.send({ status: "Success", payload: products });
    } catch (error) {
        console.log(`No se pudo obtener data: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

// POST - Crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, image, thumbnails } = req.body;
        const product = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category,
            image,
            thumbnails
        });

        console.log(product);
        res.send({ status: "Success", payload: product._id });
    } catch (error) {
        console.log(`No se pudo crear el producto: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

// PUT - Actualizar un producto
router.put("/:id", async (req, res) => {
    try {
        const updateProduct = req.body;
        const productResult = await productModel.updateOne({ _id: req.params.id }, updateProduct);
        console.log(productResult);
        res.send({ status: "Success", payload: productResult });
    } catch (error) {
        console.log(`No se pudo actualizar: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

// DELETE - Eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        const productResult = await productModel.deleteOne({ _id: req.params.id });
        console.log(productResult);
        res.send({ status: "Success", payload: productResult });
    } catch (error) {
        console.log(`No se pudo eliminar: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

export default router;
