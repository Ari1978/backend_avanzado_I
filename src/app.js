import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewRouter from "./routers/views.router.js"
import {Server} from "socket.io"

import __dirname from "./utils.js"; 


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta /public
app.use(express.static(__dirname + "/public"));

// Configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Ruta de prueba
app.get("/hello", (req, res) => {
  const usuarios = [
    {
      name: "Santiago",
      last_name: "Mendez",
      age: 26,
      email: "santiago.mendez@example.com",
      phone: "123-456-7890"
    },
    {
      name: "Lucía",
      last_name: "González",
      age: 30,
      email: "lucia.gonzalez@example.com",
      phone: "234-567-8901"
    },
    {
      name: "Martín",
      last_name: "Pérez",
      age: 22,
      email: "martin.perez@example.com",
      phone: "345-678-9012"
    },
    {
      name: "Ana",
      last_name: "López",
      age: 28,
      email: "ana.lopez@example.com",
      phone: "456-789-0123"
    },
    {
      name: "Javier",
      last_name: "Rodríguez",
      age: 35,
      email: "javier.rodriguez@example.com",
      phone: "567-890-1234"
    }
  ];

  const random = Math.floor(Math.random() * usuarios.length);
const usuarioRandom = usuarios[random];
res.render("hello", { usuario: usuarioRandom });
});

// Rutas principales con prefijo /api
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/food", viewRouter)

//Para renderizar vistas
app.use("/views", viewRouter)

app.get("/socket", (req, res) => {
    res.render("socket");
});

// Levantar el servidor
// app.listen(PORT, () => {
//  console.log(`Servidor escuchando en el puerto ${PORT}`);
// });


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//Iniciamos Socket
const socketServer = new Server(httpServer)

const messages = []

socketServer.on("connection", socket => {
console.log("Nuevo clienbte conectado!!...");

socketServer.emit("messageLogs", messages)

//Escuchando al cliente
socket.on("message", data => {
    console.log("Data: ", data);
    messages.push(data)    

    socketServer.emit("messageLogs", messages )
})


//hacemos un broadcast del nuevo user que se conecto
socket.on("userConnected", data =>{
    console.log("userConnected", data);

    socket.broadcast.emit("userConnected", data.user)
    
})

socket.on("closeChat", data => {
    console.log("close", data);
if(data.close) {
    socket.disconnect() // cierra el canal de socket
    console.log("Cal de chat cerrado para un user especifico");
    
}    
})

})