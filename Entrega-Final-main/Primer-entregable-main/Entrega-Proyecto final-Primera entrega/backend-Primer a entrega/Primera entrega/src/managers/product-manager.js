import fs from "fs"; 



class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;

        this.cargarArray(); 
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }

    async addProduct({ title, description, price, img, code, stock, category, status, thumbnail }) {

        if (!title || !description || !price || !img || !code || !stock || !category || status === undefined) {
            console.log("Todos los campos son obligatorios");
            return;
        }
    
        // 2) Validación: El precio y el stock no pueden ser negativos
        if (price <= 0 || stock < 0) {
            console.log("El precio debe ser mayor a cero y el stock no puede ser negativo");
            return;
        }
    
        // 3) El código debe ser único
        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }
    
        // 4) Crear el nuevo producto
        const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        const nuevoProducto = {
            id: lastProductId + 1,
            title,
            description,
            price: parseFloat(price),  
            img,
            code,
            stock: parseInt(stock),  
            category,
            status: status === "true", 
            thumbnail: thumbnail || "default-thumbnail.jpg", 
        };
    
        // 5) Agregar el nuevo producto al array
        this.products.push(nuevoProducto);
    
        await this.guardarArchivo(this.products);
    }
    
    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo(); 
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error); 
        }

    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id); 

            if (!buscado) {
                console.log("producto no encontrado"); 
                return null; 
            } else {
                console.log("Producto encontrado"); 
                return buscado; 
            }
        } catch (error) {
            console.log("Error al buscar por id", error); 
        }
    }

    async leerArchivo() {
        const respuesta = await fs.promises.readFile(this.path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos) {
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }


    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo(); 

            const index = arrayProductos.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProductos[index] = {...arrayProductos[index], ...productoActualizado} ; 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto actualizado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar productos"); 
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo(); 

            const index = arrayProductos.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProductos.splice(index, 1); 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto eliminado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al eliminar productos"); 
        }
    }

}

export default ProductManager; 