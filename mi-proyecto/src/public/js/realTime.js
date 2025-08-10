
const socket = io();
const container = document.getElementById("realtime-products");

// Mostrar productos existentes desde Mongo al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/products");
    const { payload: products } = await res.json();

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-id", product._id);

      card.innerHTML = `
        <img class="product-image" src="${product.image || ''}" alt="${product.title || ''}" />
        <h2 class="product-title">${product.title || ''}</h2>
        <p class="product-price"><strong>Precio:</strong> $${product.price}</p>
        <p class="product-stock"><strong>Stock:</strong> ${product.stock}</p>
        <p class="product-stock"><strong>Descripción:</strong> ${product.description}</p>
        <p class="product-stock"><strong>ID:</strong> ${product._id}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
  }
});

// Agregar producto desde socket
socket.on("nuevoProducto", (product) => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("data-id", product._id);

  card.innerHTML = `
    <img class="product-image" src="${product.image || ''}" alt="${product.title || ''}" />
    <h2 class="product-title">${product.title || ''}</h2>
    <p class="product-price"><strong>Precio:</strong> $${product.price}</p>
    <p class="product-stock"><strong>Stock:</strong> ${product.stock}</p>
    <p class="product-stock"><strong>Descripción:</strong> ${product.description}</p>
    <p class="product-stock"><strong>ID:</strong> ${product._id}</p>
  `;

  container.appendChild(card);
});

// Eliminar producto desde socket
socket.on("productoEliminado", (id) => {
  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  if (card) {
    card.remove();
  }
});

// Formulario crear producto
const formCreate = document.getElementById("form-create-product");
formCreate.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formCreate);

  const newProduct = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    image: formData.get("image") || '',
    thumbnails: [],
  };

  socket.emit("nuevoProducto", newProduct);
  formCreate.reset();
});

// Formulario eliminar producto
const formDelete = document.getElementById("form-delete-product");
formDelete.addEventListener("submit", (e) => {
  e.preventDefault();
  const idToDelete = document.getElementById("delete-id").value.trim();
  if (!idToDelete) return alert("Ingrese un ID válido");

  socket.emit("eliminarProducto", idToDelete);
  formDelete.reset();
});
