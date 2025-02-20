import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path"; // Asegura rutas correctas en todos los sistemas operativos
import methodOverride from "method-override"; // ✅ Importar method-override
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import Product from "./models/product.model.js"; // Importar modelo de productos
import Cart from "./models/cart.model.js"; // Importar modelo de carritos
import cookieParser from "cookie-parser"; // Importar cookie-parser
import "./database.js"; // Conectar a MongoDB

const app = express();
const PORT = 8080;

// Middleware
app.use(cookieParser()); // Agregar cookie-parser para manejar cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para formularios
app.use(express.static(path.resolve("src/public"))); // Asegurar ruta estática
app.use(methodOverride("_method")); // ✅ Agregar method-override

// Configuración de Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Servidor HTTP y WebSockets
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

// WebSockets: Productos en tiempo real
io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    // Enviar productos al cliente
    socket.emit("productos", await Product.find());

    // Agregar producto
    socket.on("agregarProducto", async (producto) => {
        try {
            const nuevoProducto = new Product(producto);
            await nuevoProducto.save();
            io.sockets.emit("productos", await Product.find());
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    });

    // Eliminar producto
    socket.on("eliminarProducto", async (id) => {
        try {
            await Product.findByIdAndDelete(id);
            io.sockets.emit("productos", await Product.find());
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    });
});
