const socket = io()


socket.emit("mensaje", "Hola soy el cliente!!::")

socket.on("msg_02", data => {
    console.log("Data: ", data);
    
})