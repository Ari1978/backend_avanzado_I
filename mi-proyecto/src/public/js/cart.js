const cartId = localStorage.getItem("cartId");

// Si no existe carrito, lo creamos
async function initCart() {
  if (!cartId) {
    const response = await fetch("/api/carts", { method: "POST" });
    const data = await response.json();
    localStorage.setItem("cartId", data.cart._id);
  }
}

initCart();


// Agregar producto al carrito
async function addToCart(productId) {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return alert("Carrito no inicializado");

  const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST"
  });

  const result = await response.json();
  alert(result.payload || "Producto agregado");
}


// Eliminar producto del carrito
async function removeFromCart(productId) {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return alert("Carrito no inicializado");

  const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE"
  });

  const result = await response.json();
  alert(result.payload || "Producto eliminado");
  location.reload();
}


// Vaciar carrito
async function emptyCart() {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return alert("Carrito no inicializado");

  const response = await fetch(`/api/carts/${cartId}/products`, {
    method: "DELETE"
  });

  const result = await response.json();
  alert(result.payload || "Carrito vaciado");
  location.reload();
}

