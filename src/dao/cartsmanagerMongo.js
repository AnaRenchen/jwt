import { cartsModel } from "./models/cartsModel.js";
import ProductManagerMongo from "../dao/productmanagerMongo.js";

const managerMongo = new ProductManagerMongo();

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
        (p) => p.product._id.toString() === pid
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        const product = await managerMongo.getProductbyId(pid);
        if (!product) {
          throw new Error(`Product with id ${pid} was not found.`);
        }
        cart.products.push({ product: product._id, quantity: 1 });
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
        throw new Error(`Cart with id ${cid} not found.`);
      }

      // Buscamos el producto en el carrito
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === pid
      );

      if (productIndex === -1) {
        throw new Error(`Product with id ${pid} not found in the cart.`);
      }

      // Si la cantidad es mayor que 1, simplemente reducimos la cantidad
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        // Si la cantidad es 1, eliminamos el producto del carrito
        cart.products.splice(productIndex, 1);
      }

      // Guardamos los cambios en el carrito
      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      throw error;
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
