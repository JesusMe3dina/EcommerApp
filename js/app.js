// Importar módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, enableIndexedDbPersistence, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB94R9TtM2FAROdvKzmv19KhpskCTP8GYA",
    authDomain: "app-final-f4cbc.firebaseapp.com",
    databaseURL: "https://app-final-f4cbc-default-rtdb.firebaseio.com",
    projectId: "app-final-f4cbc",
    storageBucket: "app-final-f4cbc.appspot.com",
    messagingSenderId: "367980041698",
    appId: "1:367980041698:web:dd4dfb25e54a783e0355bb",
    measurementId: "G-101CE471P5"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Habilitar persistencia offline
enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.error("No se puede habilitar la persistencia: múltiples pestañas abiertas");
            alert("No se puede habilitar la persistencia: múltiples pestañas abiertas");
        } else if (err.code === 'unimplemented') {
            console.error("La persistencia no es soportada por este navegador");
            alert("La persistencia no es soportada por este navegador");
        }
    });

const shopContent = document.getElementById("shopContent");
const cantidadCarrito = document.getElementById("cantidadCarrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para cargar productos desde Firestore
function cargarProductosDesdeFirestore() {
    const productosRef = collection(db, "productos");

    onSnapshot(productosRef, (snapshot) => {
        shopContent.innerHTML = ""; // Limpiar contenido anterior

        if (snapshot.empty) {
            shopContent.innerHTML = "<p>No hay productos disponibles.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const producto = doc.data();
            let content = document.createElement("div");
            content.className = "card";
            content.innerHTML = `
                <img src="${producto.imagenBase64}">
                <h3>${producto.nombre}</h3>
                <p class="price">${producto.precio} $</p>
            `;
            shopContent.append(content);

            let comprar = document.createElement("button");
            comprar.innerText = "Comprar";
            comprar.className = "comprar";

            content.append(comprar);

            comprar.addEventListener("click", () => {
                const repeat = carrito.some((repeatProduct) => repeatProduct.id === doc.id);

                if (repeat) {
                    // Incrementar cantidad si ya existe en el carrito
                    carrito.map((prod) => {
                        if (prod.id === doc.id) {
                            prod.cantidad++;
                        }
                    });
                } else {
                    // Agregar nuevo producto al carrito
                    carrito.push({
                        id: doc.id,
                        img: producto.imagenBase64,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: 1,
                    });
                }
                
                saveLocal(); // Guardar en localStorage
                carritoCounter(); // Actualizar contador del carrito
                pintarCarrito(); // Actualizar el contenido del carrito inmediatamente
            });
        });
    });
}

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

// Cargar productos al inicio
cargarProductosDesdeFirestore();
carritoCounter();