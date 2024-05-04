import { productsModel } from "./models/productsModel.js";

export default class ProductManagerMongo {
  async getProducts() {
    return await productsModel.find().lean();
  }

  async getProductsPaginate(page = 1, limit) {
    page = page == 0 ? 1 : page;
    const query = limit
      ? productsModel.paginate({}, { limit, page, lean: true })
      : productsModel.paginate({}, { limit: 10, page, lean: true });
    return await query;
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
