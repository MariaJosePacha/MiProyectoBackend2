import express from "express";
import ProductManager from "../managers/product-manager.js";
import CartManager from "../managers/cart-manager.js";

const manager = new ProductManager("./src/data/productos.json");
const cartManager = new CartManager("./src/data/carts.json");
const router = express.Router();

// La ruta raíz GET
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;
        const limitParsed = parseInt(limit); 
        const pageParsed = parseInt(page);   

        if (isNaN(limitParsed) || isNaN(pageParsed) || limitParsed <= 0 || pageParsed <= 0) {
            return res.status(400).json({ error: 'Los parámetros limit y page deben ser números positivos.' });
        }

        const productos = await manager.getProducts();

        // Filtrar los productos según el query
        let filteredProducts = productos.filter(product => {
            return (
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                (query.toLowerCase() === "true" && product.status === true) ||
                (query.toLowerCase() === "false" && product.status === false)
            );
        });

        // Ordenar los productos si se proporciona 'sort'
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limitParsed);

        const startIndex = (pageParsed - 1) * limitParsed;
        const endIndex = startIndex + limitParsed;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        const response = {
            status: "success",
            payload: paginatedProducts,
            totalPages,
            prevPage: pageParsed > 1 ? pageParsed - 1 : null,
            nextPage: pageParsed < totalPages ? pageParsed + 1 : null,
            page: pageParsed,
            hasPrevPage: pageParsed > 1,
            hasNextPage: pageParsed < totalPages,
            prevLink: pageParsed > 1 ? `/products?page=${pageParsed - 1}&limit=${limitParsed}` : null,
            nextLink: pageParsed < totalPages ? `/products?page=${pageParsed + 1}&limit=${limitParsed}` : null
        };

        res.json(response); // Devolver la respuesta en formato JSON
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta GET para obtener producto por ID
router.get("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const productoBuscado = await manager.getProductById(id);

        if (!productoBuscado) {
            res.send("Producto no encontrado");
        } else {
            res.json(productoBuscado); // Retorna el producto
        }
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
});

// Ruta POST para agregar un producto al carrito
router.post("/carts/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.addProductToCart(cid, pid);

        // Respuesta indicando que el producto fue agregado correctamente
        res.status(200).send("Producto agregado al carrito");
    } catch (error) {
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

// Ruta POST para agregar un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        res.status(500).send("Error al momento de agregar el producto");
    }
});

// Ruta PUT para actualizar un producto
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await manager.updateProduct(id, productoActualizado);
        res.send("Producto actualizado exitosamente");
    } catch (error) {
        res.status(500).send("Error al actualizar el producto");
    }
});

// Ruta DELETE para eliminar un producto
router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        await manager.deleteProduct(id);
        res.send("Producto eliminado");
    } catch (error) {
        res.status(500).send("Error, no se logró borrar el producto");
    }
});

export default router;
