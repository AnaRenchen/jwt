import { Router } from "express";
import CartsManagerMongo from "../dao/cartsmanagerMongo.js";
import ProductManagerMongo from "../dao/productmanagerMongo.js";
import { isValidObjectId } from "mongoose";
export const router2 = Router();

const cartsMongo = new CartsManagerMongo();
const managerMongo = new ProductManagerMongo();

router2.post("/", async (req, res) => {
  try {
    let newCart = await cartsMongo.createCart();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(newCart);
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router2.get("/:cid", async (req, res) => {
  try {
    let id = req.params.cid;
    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Please choose a valid Mongo id." });
    }

    let products = await cartsMongo.getCartbyId(id);

    if (products) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(products);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `There are no carts with id: ${id}` });
    }
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router2.post("/:cid/product/:pid", async (req, res) => {
  try {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Please choose a valid Mongo id." });
    }

    const cart = await cartsMongo.getCartbyId(cid);
    if (!cart) {
      res.setHeader("Content-Type", "application/json");
      return res.status(404).json({ error: "Cart not found." });
    }

    const findproduct = await managerMongo.getProductbyId(pid);

    if (!findproduct) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `Product with id ${pid} was not found.` });
    }

    const updatedCart = await cartsMongo.addProductCart(cart, pid);

    if (updatedCart) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ message: "Product added.", updatedCart });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `There was an error updating cart.` });
    }
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router2.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ error: "Please choose valid Mongo IDs." });
    }

    const cart = await cartsMongo.getCartbyId(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Cart with id ${cid} was not found.` });
    }

    const product = cart.products.find((p) => p.product.toString() === pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with id ${pid} was not found in the cart.` });
    }

    const updatedCart = await cartsMongo.deleteProductCart(cid, pid);

    if (!updatedCart) {
      return res
        .status(500)
        .json({ error: "Failed to remove product from cart." });
    }

    return res.status(200).json({
      message: `Product with id ${pid} was removed from the cart.`,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router2.delete("/:cid/", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
      return res
        .status(400)
        .json({ error: "Please choose a valid Mongo ID for the cart." });
    }

    const deletedCart = await cartsMongo.deleteCart(cid);

    if (!deletedCart) {
      return res.status(404).json({
        error: `Cart with id ${cid} was not found or an error occurred.`,
      });
    }

    return res.status(200).json({
      message: `All products were removed from the cart.`,
      cart: deletedCart,
    });
  } catch (error) {
    console.error("Error deleting all products from cart:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
