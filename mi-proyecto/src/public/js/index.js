const socket = io();

socket.emit("mensaje", "Cliente conectado a catálogo!");

const productList = document.querySelector(".product-list");

socket.on("nuevoProducto", (nuevoProd) => {
  if (!nuevoProd) return;

  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${nuevoProd.image || 'https://via.placeholder.com/150'}" alt="${nuevoProd.name}">
    <h2>${nuevoProd.name}</h2>
    <p><strong>Categoría:</strong> ${nuevoProd.category || "General"}</p>
    <p><strong>Precio:</strong> $${nuevoProd.price}</p>
    <p><strong>Stock:</strong> ${nuevoProd.stock}</p>
    <p>${nuevoProd.description || ""}</p>
    <button class="add-to-cart-btn" data-id="${nuevoProd._id}">Agregar al carrito</button>
  `;

  productList.appendChild(card);
});

// Delegación de evento para botones "Agregar al carrito"
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.getAttribute("data-id");
    socket.emit("agregarAlCarrito", productId);
    alert("Producto agregado al carrito!");
  }
});

// Mensaje si no hay productos (al cargar la página)
socket.on("productosIniciales", (productos) => {
  productList.innerHTML = ""; // limpiar
  if (productos.length === 0) {
    productList.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/150'}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p><strong>Categoría:</strong> ${p.category || "General"}</p>
      <p><strong>Precio:</strong> $${p.price}</p>
      <p><strong>Stock:</strong> ${p.stock}</p>
      <p>${p.description || ""}</p>
      <button class="add-to-cart-btn" data-id="${p._id}">Agregar al carrito</button>
    `;
    productList.appendChild(card);
  });
});
