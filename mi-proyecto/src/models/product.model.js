import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

// nombre de colección
const productCollection = "products";

// definimos esquema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "El título es obligatorio"]
    },
    description: String,
    code: {
        type: String,
        unique: true,
        required: [true, "El código es obligatorio"]
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"]
    },
    category: String,
    image: String,
    thumbnails: [String] // arreglo de strings por si hay varias imágenes
}, {
    versionKey: false
});

productSchema.plugin(mongoosePaginate);

// creación del modelo de productos
export const productModel = mongoose.model(productCollection, productSchema);
