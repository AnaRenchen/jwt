import { Router } from "express";
import ProductManagerMongo from "../dao/productmanagerMongo.js";
import CartsManagerMongo from "../dao/cartsmanagerMongo.js";
export const router3 = Router();

const managerMongo = new ProductManagerMongo();
const cartsMongo = new CartsManagerMongo();

router3.get("/home", async (req, res) => {
  try {
    let { docs: products } = await managerMongo.getProductsPaginate();

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
    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort;

    const filter = {};
    const validCategories = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
      "status",
      "category",
    ];

    for (const key in req.query) {
      if (validCategories.includes(key)) {
        filter[key] = req.query[key];
      }
    }

    const sortOptions = {};
    if (sort === "asc") {
      sortOptions.price = 1;
    } else if (sort === "desc") {
      sortOptions.price = -1;
    }

    let result = await managerMongo.getProductsPaginate(
      page,
      limit,
      filter,
      sortOptions
    );

    const hasNextPage = result.nextPage !== null;
    const hasPrevPage = result.prevPage !== null;

    const prevLink = hasPrevPage
      ? `/products?page=${result.prevPage}&limit=${limit}`
      : null;
    const nextLink = hasNextPage
      ? `/products?page=${result.nextPage}&limit=${limit}`
      : null;

    res.render("realtimeproducts", {
      status: "success",
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router3.get("/products", async (req, res) => {
  try {
    let cartId = "663a9a3d9002c4c009f36832";

    let limit = req.query.limit || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort;

    const filter = {};
    const validCategories = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
      "status",
      "category",
    ];

    for (const key in req.query) {
      if (validCategories.includes(key)) {
        filter[key] = req.query[key];
      }
    }

    const sortOptions = {};
    if (sort === "asc") {
      sortOptions.price = 1;
    } else if (sort === "desc") {
      sortOptions.price = -1;
    }

    let result = await managerMongo.getProductsPaginate(
      page,
      limit,
      filter,
      sortOptions
    );

    const hasNextPage = result.nextPage !== null;
    const hasPrevPage = result.prevPage !== null;

    const prevLink = hasPrevPage
      ? `/products?page=${result.prevPage}&limit=${limit}`
      : null;
    const nextLink = hasNextPage
      ? `/products?page=${result.nextPage}&limit=${limit}`
      : null;

    res.render("products", {
      status: "success",
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
      cartId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
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
    const cart = await cartsMongo.getCartbyId({ _id: cid }, true);

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
