import { Router } from "express";
import ProductManagerMongo from "../dao/productmanagerMongo.js";
import CartsManagerMongo from "../dao/cartsmanagerMongo.js";
import { auth } from "../middleware/auth.js";
import { auth2 } from "../middleware/auth2.js";

export const router3 = Router();

const managerMongo = new ProductManagerMongo();
const cartsMongo = new CartsManagerMongo();

router3.get("/home", auth2, async (req, res) => {
  try {
    let cart = null;
    if (req.user) {
      cart = {
        _id: req.user.cart._id,
      };
    }

    let { docs: products } = await managerMongo.getProductsPaginate();

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home", {
      products,
      titulo: "Horisada",
      user: req.user,
      cart,
    });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router3.get("/realtimeproducts", auth, auth2, async (req, res) => {
  try {
    let cart = null;
    if (req.user) {
      cart = {
        _id: req.user.cart._id,
      };
    }

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

    const prevParams = new URLSearchParams({
      ...req.query,
      page: result.prevPage,
      totalPages: result.totalPages,
    });
    const prevLink = hasPrevPage
      ? `/realtimeproducts?${prevParams.toString()}`
      : null;

    const nextParams = new URLSearchParams({
      ...req.query,
      page: result.nextPage,
      totalPages: result.totalPages,
    });
    const nextLink = hasNextPage
      ? `/realtimeproducts?${nextParams.toString()}`
      : null;
    const currentPage = page;

    res.render("realtimeproducts", {
      cart,
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
      currentPage,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router3.get("/products", auth2, async (req, res) => {
  try {
    let cart = null;
    if (req.user) {
      cart = {
        _id: req.user.cart._id,
      };
    }

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

    const prevParams = new URLSearchParams({
      ...req.query,
      page: result.prevPage,
      totalPages: result.totalPages,
    });
    const prevLink = hasPrevPage ? `/products?${prevParams.toString()}` : null;

    const nextParams = new URLSearchParams({
      ...req.query,
      page: result.nextPage,
      totalPages: result.totalPages,
    });
    const nextLink = hasNextPage ? `/products?${nextParams.toString()}` : null;
    const currentPage = page;

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
      currentPage,
      cart,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router3.get("/chat", auth2, async (req, res) => {
  try {
    let cart = null;
    if (req.user) {
      cart = {
        _id: req.user.cart._id,
      };
    }

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("chat", { cart, user: req.user });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "text/html");
    return res.status(500).json({ error: "Internal server error." });
  }
});

router3.get("/carts/:cid", auth2, async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartsMongo.getCartbyId({ _id: cid }, true);

    if (!cart) {
      res.status(404).send("Cart not found");
      return;
    }
    res.status(200).render("carts", { cart, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router3.get(
  "/register",
  auth2,
  (req, res, next) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    next();
  },
  (req, res) => {
    try {
      let { error } = req.query;
      res.status(200).render("register", { error, user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

router3.get("/login", auth2, async (req, res) => {
  try {
    let { error } = req.query;

    res.status(200).render("login", { error, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router3.get("/profile", auth2, async (req, res) => {
  try {
    let cart = null;
    if (req.user) {
      cart = {
        _id: req.user.cart._id,
      };
    }

    res.status(200).render("profile", {
      user: req.user,
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
