import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router();

// GET
router.get("/", async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({ status: "Success", payload: users });
    } catch (error) {
        console.log(`No se pudo obtener data: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

// POST
router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, age } = req.body;
        const users = await userModel.create({ first_name, last_name, email, age });
        console.log(users);
        res.send({ status: "Success", payload: users._id });
    } catch (error) {
        console.log(`No se pudo crear el usuario: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

// PUT
router.put("/:id", async (req, res) => {
    try {
        const updateUser = req.body;
        const userResult = await userModel.updateOne({ _id: req.params.id }, updateUser);
        console.log(userResult);
        res.send({ status: "Success", payload: userResult });
    } catch (error) {
        console.log(`No se pudo actualizar: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const userResult = await userModel.deleteOne({ _id: req.params.id });
        console.log(userResult);
        res.send({ status: "Success", payload: userResult });
    } catch (error) {
        console.log(`No se pudo eliminar: error: ${error}`);
        res.status(500).send({ status: "Error", message: error.message });
    }
});

export default router;
