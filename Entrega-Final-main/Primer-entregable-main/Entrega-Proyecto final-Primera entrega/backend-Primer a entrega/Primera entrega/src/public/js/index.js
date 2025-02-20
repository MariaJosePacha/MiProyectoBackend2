const socket = io(); // Conexión a WebSocket

socket.on("productos", (productos) => {
    renderProductos(productos); // Renderiza la lista de productos
});

// Función para renderizar los productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = ""; 

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        
        // Mostramos solo el título, precio y el botón de eliminar
        card.innerHTML = `
            <p><strong>Título:</strong> ${item.title}</p>
            <p><strong>Precio:</strong> $${item.price}</p>
            <button class="btnEliminar" data-id="${item._id}">Eliminar</button>
        `;
        contenedorProductos.appendChild(card);

        // Evento para eliminar el producto
        card.querySelector(".btnEliminar").addEventListener("click", () => {
            eliminarProducto(item._id); 
        });
    });
}

// Función para eliminar un producto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id); // id del producto a eliminar
}

// Agg desde el formulario
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto(); 
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: parseFloat(document.getElementById("price").value),
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: parseInt(document.getElementById("stock").value),
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        thumbnail: document.getElementById("thumbnail").value,
    };

    if (producto.stock < 0 || producto.price < 0) {
        alert("El stock o precio no pueden ser negativos.");
        return;
    }

    socket.emit("agregarProducto", producto); // agg el producto
}
