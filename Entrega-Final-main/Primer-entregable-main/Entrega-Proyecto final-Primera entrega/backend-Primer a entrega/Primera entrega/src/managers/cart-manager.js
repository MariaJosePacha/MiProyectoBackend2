import fs from "fs";

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;

        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {

                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar los carritos. Es posible que no exista el archivo. Se creará uno nuevo.");
            await this.guardarCarritos(); // Si no existe el archivo, se creo
        }
    }

    async guardarCarritos() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.log("Error al guardar los carritos:", error);
            throw new Error("No se pudo guardar el archivo de carritos");
        }
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(nuevoCarrito);
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(carritoId) {
        const carritoBuscado = this.carts.find(carrito => carrito.id === carritoId);

        if (!carritoBuscado) {
            throw new Error(`No existe un carrito con el id: ${carritoId}`);
        }

        return carritoBuscado;
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);

        if (existeProducto) {
            // Si el producto ya está en el carrito, se aumenta la cantidad
            existeProducto.quantity += quantity;
        } else {
            // Si no está, se agrega con la cantidad especificada
            carrito.products.push({ product: productoId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }
}

export default CartManager;
