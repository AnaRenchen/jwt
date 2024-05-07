import { productsModel } from "./models/productsModel.js";

export default class ProductManagerMongo {
  async getProductsPaginate(page = 1, limit = 10, filter = {}, sort = {}) {
    const options = {
      page: page,
      limit: parseInt(limit),
      lean: true,
      sort: sort,
    };
    return await productsModel.paginate(filter, options);
  }

  async getProductBy(filter) {
    return await productsModel.findOne(filter).lean();
  }

  async addProduct(product) {
    return await productsModel.create(product);
  }

  async getProductbyId(id) {
    return await productsModel.findOne({ _id: id });
  }

  async updateProduct(id, product) {
    return await productsModel.findByIdAndUpdate({ _id: id }, product, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async deleteProduct(id) {
    return await productsModel.deleteOne({ _id: id });
  }
}
