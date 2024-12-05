const modalContainer = document.getElementById("modal-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para pintar el carrito
const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `<h1 class="modal-header-title">Carrito.</h1>`;
    
    modalContainer.append(modalHeader);
  
    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";
  
    modalbutton.addEventListener("click", () => {
      modalContainer.style.display = "none";
    });
  
    modalHeader.append(modalbutton);
  
    // Verificar si hay productos en el carrito
    if (carrito.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "El carrito está vacío.";
        modalContainer.append(emptyMessage);
        return; // Salir si no hay productos
    }

    // Iterar sobre los productos en el carrito
    carrito.forEach((product) => {
      let carritoContent = document.createElement("div");
      carritoContent.className = "modal-content";
      carritoContent.innerHTML = `
          <img src="${product.img}">
          <h3>${product.nombre}</h3>
          <p>${product.precio} $</p>
          <span class="restar"> - </span>
          <p>${product.cantidad}</p>
          <span class="sumar"> + </span>
          <p>Total: ${product.cantidad * product.precio} $</p>
          <span class="delete-product"> ❌ </span>
      `;
  
      modalContainer.append(carritoContent);
  
      let restar = carritoContent.querySelector(".restar");
      restar.addEventListener("click", () => {
        if (product.cantidad > 1) {
          product.cantidad--;
        } else {
          eliminarProducto(product.id); // Eliminar producto si la cantidad es 1
        }
        saveLocal();
        pintarCarrito(); // Actualizar la vista del carrito
      });
  
      let sumar = carritoContent.querySelector(".sumar");
      sumar.addEventListener("click", () => {
        product.cantidad++;
        saveLocal();
        pintarCarrito(); // Actualizar la vista del carrito
      });
  
      let eliminar = carritoContent.querySelector(".delete-product");
      eliminar.addEventListener("click", () => {
        eliminarProducto(product.id);
      });
    });

    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
  
    const totalBuying = document.createElement("div");
    totalBuying.className = "total-content";
    totalBuying.innerHTML = `Total a pagar: ${total} $`;
    modalContainer.append(totalBuying);
};

// Evento para mostrar el carrito
verCarrito.addEventListener("click", pintarCarrito);

// Función para eliminar producto del carrito
const eliminarProducto = (id) => {
  const foundId = carrito.find((element) => element.id === id);

  if (foundId) {
      carrito = carrito.filter((carritoId) => {
          return carritoId !== foundId;
      });

      saveLocal();
      pintarCarrito(); // Actualizar la vista del carrito
  }
};

// Función para guardar el carrito en localStorage
const saveLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Contador del carrito
const carritoCounter = () => {
  cantidadCarrito.style.display = "block";
  const totalProductosEnCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0); // Total de productos en el carrito

  localStorage.setItem("carritoLength", JSON.stringify(totalProductosEnCarrito));
  
  cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
};

// Inicializar contador al cargar la página
carritoCounter();