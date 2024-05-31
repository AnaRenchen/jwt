import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils.js";

export const router4 = Router();

router4.get("/github", passport.authenticate("github", { session: false }));

router4.get(
  "/callbackGithub",
  passport.authenticate("github", {
    session: false,
  }),
  (req, res) => {
    let user = req.user;
    let token = jwt.sign(user, SECRET, { expiresIn: "5h" });

    res.cookie("anarenchencookie", token, { httpOnly: true });

    if (user) {
      return res.redirect(
        `/products?message=Welcome, ${req.user.name}, rol: ${req.user.rol}!`
      );
    } else {
      return res.status(200).json({
        status: "success",
        message: "User authenticated with Github.",
        token,
        username: user.name,
      });
    }
  }
);

router4.get("/error", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({
    error: `Invalid user or password. Please try again.`,
  });
});

router4.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/register?error=Failed to register, please try again.",
  }),
  async (req, res) => {
    let { web } = req.body;
    if (web) {
      return res.redirect(`/login?message=Registration sucessful!`);
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({
        message: "Registration process successful.",
      });
    }
  }
);

router4.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  async (req, res) => {
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
  }
);

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
