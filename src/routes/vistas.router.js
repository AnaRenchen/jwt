import { Router } from "express";
import ProductManagerMongo from "../dao/productmanagerMongo.js";
export const router3 = Router();

const managerMongo = new ProductManagerMongo();

router3.get("/home", async (req, res) => {
  try {
    let products = await managerMongo.getProducts();

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home", { products, titulo: "Horisada" });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router3.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await managerMongo.getProducts();

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("realTimeProducts", { products });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router3.get("/products", async (req, res) => {
  try {
    let { pagina } = req.query;
    if (!pagina) pagina = 1;

    let { limit } = req.query;
    if (!limit) limit = 10;

    let {
      docs: products,
      payload,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
    } = await managerMongo.getProductsPaginate(pagina, limit);

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("products", {
      products,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router3.get("/chat", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("chat");
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).json({ error: "Internal server error." });
  }
});
