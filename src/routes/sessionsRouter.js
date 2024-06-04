import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils.js";
import { passportCall } from "../middleware/passportCall.js";

export const router4 = Router();

router4.get("/github", passport.authenticate("github", { session: false }));

router4.get("/callbackGithub", passportCall("github"), (req, res) => {
  let dataToken = {
    name: req.user.name,
    email: req.user.email,
    rol: req.user.rol,
    cart: req.user.cart,
  };

  let token = jwt.sign(dataToken, SECRET, { expiresIn: "5h" });

  res.cookie("anarenchencookie", token, { httpOnly: true });

  if (dataToken) {
    return res.redirect(
      `/products?message=Welcome, ${req.user.name}, rol: ${req.user.rol}!`
    );
  }
});

router4.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({
    error: `Invalid user or password. Please try again.`,
  });
});

router4.post("/register", passportCall("register"), async (req, res) => {
  let { web } = req.body;
  if (web) {
    return res.redirect(`/login?message=Registration sucessful!`);
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({
      message: "Registration process successful.",
    });
  }
});

router4.post("/login", passportCall("login"), async (req, res) => {
  try {
    let user = { ...req.user };
    delete user.password;

    let token = jwt.sign(user, SECRET, { expiresIn: "5h" });

    res.cookie("anarenchencookie", token, { httpOnly: true });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      payload: "Login successful!",
      username: user.name,
      rol: user.rol,
      token,
    });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected error.`,
      detalle: `${error.message}`,
    });
  }
});

router4.get("/logout", (req, res) => {
  res.clearCookie("anarenchencookie");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Logout successful." });
});

router4.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: "Perfil usuario",
      user: req.user,
    });
  }
);
