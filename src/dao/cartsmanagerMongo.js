import { cartsModel } from "./models/cartsModel.js";

export default class CartsManagerMongo {
  async getCarts() {
    return await cartsModel.find().populate("products.product");
  }

  async createCart(product) {
    return await cartsModel.create(product);
  }

  async getCartbyId(id) {
    return await cartsModel.findOne({ _id: id }).populate("products.product");
  }

  async addProductCart(cart, pid) {
    try {
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === pid
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      return await cart.save();
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return null;
    }
  }

  async deleteProductCart(cid, pid) {
    try {
      const cart = await cartsModel.findOne({ _id: cid });

      if (!cart) {
        throw new Error(`Cart with id ${cid} was not found.`);
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );

      if (productIndex === -1) {
        throw new Error(`Product with id ${pid} was not found in the cart.`);
      }

      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }

      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error removing product from cart:", error);
      return null;
    }
  }

  async deleteCart(cid) {
    try {
      const cart = await cartsModel.findById(cid);

      if (!cart) {
        throw new Error(`Cart with id ${cid} was not found.`);
      }

      cart.products = [];
      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error deleting all products from cart:", error);
      return null;
    }
  }
}
