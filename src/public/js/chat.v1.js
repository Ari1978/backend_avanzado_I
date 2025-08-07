const socket = io()


const input = document.getElementById ("textoEntrada")
const logsHBs = document.getElementById ("messageLogs")

Swal.fire({
  icon: "info",  
  title: "Ingrese un nombre de usuario",
  input: "text",
  text: "Ingrese el userName para identificarse en el chat",

  inputValidator: (value) => {
    if(!value) {
        return "Necesitas escribir tu userName para continuar!.."
    }else {
        socket.emit("userConnected", { user: value })
    }
  },
  //es para no dejar avanzar el usurio si no pone su userName
  allowOutsideClick: false

}).then((result) => {
  user = result.value

  //Cargar el nombre en el HTML
  document.getElementById("myName").innerHTML = user

});

//Guardar mensaje por usuario
input.addEventListener("keyup", evt => {
  if (evt.key === "Enter") {
    // Pre-procesado del mensaje
    let newData = input.value.trim();

    if (newData.length > 0) {
      socket.emit("message", { user: user, message: newData });
      input.value = "";
    } else {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Por favor ingrese un mensaje!.."
      });
    }
  }
});

socket.on("messageLogs", data => {
    let logs = ""
    data.forEach(log => {
        logs += `<div><span><b>${log.user}</b>:</span> ${log.message}</div>`
    })
    document.getElementById("messageLogs").innerHTML = logs;
})

//Aqui escuchamos al nuevo usuario que se conecto
socket.on("userConnected", userData => {
    if(!user) return
    
    let message = `New user conect: ${userData}`
    Swal.fire({
        icon: "info",
        text: message, 
        toast: true,
        position: "top-end",
    })
})

const closeChat = document.getElementById("closeChatBox")
closeChat.addEventListener("click", evt => {
    // alert("Test")
    socket.emit("closeChat", { close: true })
    logsHBs.innerHTML = ""
})