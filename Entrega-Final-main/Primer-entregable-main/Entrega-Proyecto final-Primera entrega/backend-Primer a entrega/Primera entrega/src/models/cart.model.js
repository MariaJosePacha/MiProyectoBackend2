import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {  // Cambié 'user_id' por 'user'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Referencia al modelo de usuario
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', 
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1 // Se asegura de que la cantidad no sea menor que 1
            }
        }
    ],
    state: {
        type: String,
        enum: ['reserved', 'paid', 'delivered'], // Definir los posibles estados de la compra
        default: 'reserved', // Estado por defecto
        required: true
    }
});

// Middleware para hacer el populate de productos cuando se busca un carrito
cartSchema.pre("find", function(next) {  // Apliqué el 'populate' para todos los métodos de búsqueda
    this.populate("products.product");
    next();
});

cartSchema.pre("findOne", function(next) {
    this.populate("products.product");
    next();
});

const Cart = mongoose.model('Cart', cartSchema); // Mejor renombrar a 'Cart' para mayor claridad

export default Cart;
