import { productsModel } from "./models/productsModel.js";

export default class ProductManagerMongo {
  async getProducts() {
    return await productsModel.find().lean();
  }

  async getProductBy(filter) {
    return await productsModel.findOne(filter);
  }

  async addProduct(product) {
    return await productsModel.create(product);
  }

  async getProductbyId(_id) {
    return await productsModel.findOne({ _id });
  }

  async updateProduct(id, product) {
    return await productsModel.findByIdAndUpdate(id, product, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async deleteProduct(id) {
    return await productsModel.deleteOne({ _id: id });
  }
}
