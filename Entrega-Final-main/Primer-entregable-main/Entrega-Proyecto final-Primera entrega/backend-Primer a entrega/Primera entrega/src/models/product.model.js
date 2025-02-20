import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Importa mongoose-paginate-v2

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 1, // Puedes asignar un precio por defecto si lo deseas
  },
  img: {
    type: String,
    default: "default-product-img.jpg", // Ruta de imagen por defecto
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 1, // Puedes poner 1 como valor predeterminado si no se especifica
  },
  category: {
    type: String,
    required: true,
    enum: ["electronics", "clothing", "food", "home", "other"], // Puedes definir categorías fijas o dejarlas abiertas
    default: "other", // Valor por defecto
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "out of stock", "discontinued"], // Enum para manejar el estado del producto
    default: "available", // Estado por defecto
  },
  thumbnails: {
    type: [String],
    default: ["default-thumbnail.jpg"], // Puede tener una miniatura por defecto si no se especifica
  },
});

// Agrega el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema); // Renombrado a "Product" para mayor claridad
export default ProductModel;
