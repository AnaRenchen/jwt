import { Router } from "express";
import ProductManagerMongo from "../dao/productmanagerMongo.js";
import CartsManagerMongo from "../dao/cartsmanagerMongo.js";
export const router3 = Router();

const managerMongo = new ProductManagerMongo();
const cartsMongo = new CartsManagerMongo();

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
    let { page, limit, category, stock, sort } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;

    let totalProducts = await managerMongo.getProducts();

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (stock) {
      filter.stock = stock;
    }

    const sortOption = {};
    if (sort) {
      if (sort === "price_asc") {
        sortOption.price = 1;
      } else if (sort === "price_desc") {
        sortOption.price = -1;
      }
    }

    let {
      docs: products,
      payload,
      totalPages,
      page: currentpage,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await managerMongo.getProductsPaginate(page, limit, sortOption, filter);

    const prevLink = hasPrevPage
      ? `http://localhost:3000/products?page=${prevPage}`
      : "";
    const nextLink = hasNextPage
      ? `http://localhost:3000/products?page=${nextPage}`
      : "";

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("products", {
      status: "success",
      products,
      payload,
      totalPages,
      prevPage,
      nextPage,
      currentpage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
      totalProducts,
      category,
      sort,
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

router3.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartsMongo.getCartbyId(cid, true);

    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }
    res.status(200).render("carts", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
