import { Router } from "express";
import ProductManagerMongo from "../dao/productmanagerMongo.js";
import { io } from "../app.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

const managerMongo = new ProductManagerMongo();

router.get("/", async (req, res) => {
  try {
    let products = await managerMongo.getProducts();
    let limit = req.query.limit;

    if (!limit) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(products);
    }

    limit = Number(limit);
    if (isNaN(limit)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Limit must be a number." });
    }

    if (limit && limit >= 0) {
      products = products.slice(0, limit);
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Please choose a valid Mongo id." });
    }

    let product = await managerMongo.getProductBy({ _id: id });

    if (product) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ product });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `There are no products with id: ${id}` });
    }
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/", async (req, res) => {
  try {
    let {
      title,
      description,
      category,
      price,
      status,
      thumbnail,
      code,
      stock,
    } = req.body;

    let exists;
    try {
      exists = await managerMongo.getProductBy({ code });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Internal server error." });
    }

    if (exists) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `Product with code ${code} already exists` });
    }

    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !status ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
        error: `All fields are required: title, description, category, price, status, thumbnail, code, stock.`,
      });
    }

    let newProduct = await managerMongo.addProduct({
      title,
      description,
      category,
      price,
      status,
      thumbnail,
      code,
      stock,
    });

    let productsList = await managerMongo.getProducts();
    io.emit("newproduct", productsList);
    console.log("added");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ message: "Product added.", newProduct });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;

    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Please choose a valid Mongo id." });
    }

    let updateProperties = req.body;

    if (updateProperties.code) {
      let exists;
      try {
        exists = await managerMongo.getProductBy({
          _id: { $ne: id },
          code: updateProperties.code,
        });
        if (exists) {
          res.setHeader("Content-Type", "application/json");
          return res.status(400).json({
            error: `The code ${updateProperties.code} already exists.`,
          });
        }
      } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Internal server error." });
      }
    }

    if (!updateProperties) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Properties not valid." });
    }

    let validProperties = [
      "title",
      "description",
      "category",
      "price",
      "status",
      "thumbnail",
      "code",
      "stock",
    ];
    let properties = Object.keys(updateProperties);
    let valid = properties.every((prop) => validProperties.includes(prop));

    if (!valid) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
        error: `The properties you are trying to update are not valid or do not exist. Valid properties are: ${validProperties}.`,
      });
    }

    let updatedProduct = await managerMongo.updateProduct(id, updateProperties);

    if (!updatedProduct) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `Product with id ${id} was not found.` });
    }

    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json({ message: `Product with id ${id} was updated.`, updatedProduct });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;

    if (!isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Please choose a valid Mongo id." });
    }

    let product = await managerMongo.getProductbyId(id);
    if (!product) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(404)
        .json({ error: `Product with id ${id} was not found.` });
    }

    let result = await managerMongo.deleteProduct(id);
    if (result.deletedCount > 0) {
      let products = await managerMongo.getProducts();
      io.emit("deletedproduct", products);
      console.log("Product deleted");
      return res
        .status(200)
        .json({ message: `Product with id ${id} was deleted.` });
    } else {
      return res
        .status(400)
        .json({ error: `Product with id ${id} could not be deleted.` });
    }
  } catch (error) {
    console.error("Error in deleting product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
