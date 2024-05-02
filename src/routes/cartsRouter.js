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
      console.error("Cart not found!");
      return null;
    }

    const product = await managerMongo.getProductbyId(pid);
    if (!product) {
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