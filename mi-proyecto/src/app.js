import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import createProductsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewRouter from "./routers/views.router.js";
import usersRouter from "./routers/users.routers.js";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { loadProducts } from "./productsManager.js";
import { productModel } from "./models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: Variable MONGODB_URI no definida en .env");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.get("/", async (req, res) => {
  try {
    const products = await loadProducts();
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error cargando productos");
  }
});

app.use("/api/products", createProductsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewRouter);

const messages = [];

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado con éxito a la base de datos!!...");

    const response = await productModel.find({ category: "Electrónica" }).explain("executionStats");
    console.log("Búsqueda de productos");
    console.dir(response, { depth: null });

    const httpServer = app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socket) => {
      console.log("Nuevo cliente conectado");

      socket.emit("messageLogs", messages);

      socket.on("message", (data) => {
        messages.push(data);
        socketServer.emit("messageLogs", messages);
      });

      socket.on("nuevoProducto", async (producto) => {
        try {
          const newProduct = await productModel.create(producto);
          socketServer.emit("nuevoProducto", newProduct);
        } catch (error) {
          console.error("Error creando producto:", error);
        }
      });

      socket.on("eliminarProducto", async (id) => {
        try {
          const result = await productModel.deleteOne({ _id: id });
          if (result.deletedCount === 1) {
            socketServer.emit("productoEliminado", id);
          } else {
            console.warn(`Producto con ID ${id} no encontrado para eliminar`);
          }
        } catch (error) {
          console.error("Error eliminando producto:", error);
        }
      });

      socket.on("userConnected", (data) => {
        socket.broadcast.emit("userConnected", data.user);
      });

      socket.on("closeChat", (data) => {
        if (data.close) {
          socket.disconnect();
        }
      });
    });
  } catch (error) {
    console.error("No se pudo conectar a la base de datos de Mongo:", error);
    process.exit(1);
  }
};

connectMongoDB();

