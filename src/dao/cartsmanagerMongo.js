import { cartsModel } from "./models/cartsModel.js";

export default class CartsManagerMongo {
  async getCarts() {
    return await cartsModel.find();
  }

  async createCart(product) {
    return await cartsModel.create(product);
  }

  async getCartbyId(id) {
    return await cartsModel.findOne({ _id: id });
  }

  async addProductCart(cart, pid) {
    try {
      const existingProduct = cart.products.findIndex(
        (item) => item.pid === pid
      );

      if (existingProduct !== -1) {
        cart.products[existingProduct].quantity += 1;
      } else {
        cart.products.push({ pid, quantity: 1 });
      }

      return await cart.save();
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return null;
    }
  }
}
