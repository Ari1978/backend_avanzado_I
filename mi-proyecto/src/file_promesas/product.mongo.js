import { productModel } from "../models/product.model.js";

export async function crearProduct(data) {
  return await productModel.create(data);
}

export async function consultarProducts() {
  return await productModel.find();
}
