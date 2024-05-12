import { Router } from "express";
import { usersManagerMongo as UsersManager } from "../dao/usersmanager.js";
import { generateHash } from "../utils.js";

export const router4 = Router();

const usersManager = new UsersManager();

router4.post("/register", async (req, res) => {
  try {
    let { name, email, password, web } = req.body;

    if (!name || !email || !password) {
      if (web) {
        return res.redirect(
          `/register?error=Please enter name, email and password`
        );
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `Please enter name, email and password.` });
      }
    }

    let exist = await usersManager.getBy({ email });
    if (exist) {
      if (web) {
        return res.redirect(`/register?error=This email is aready registered.`);
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `The email ${email} already exists.` });
      }
    }

    password = generateHash(password);

    let newUser = await usersManager.create({
      name,
      email,
      password,
      rol: "user",
    });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: "Registration successful!",
      name: newUser.name,
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

router4.post("/login", async (req, res) => {
  try {
    let { email, password, web } = req.body;
    if (!email || !password) {
      if (web) {
        return res.redirect(`/login?error=Please complete email and password`);
      } else {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `Complete email and password` });
      }
    }

    let user = await usersManager.getBy({
      email,
      password: generateHash(password),
    });

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      user = {
        email,
        password,
        rol: "admin",
      };
    }

    if (!user) {
      if (web) {
        return res.redirect(`/login?error=Invalid email or password`);
      } else {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `Invalid email or password` });
      }
    }

    user = { ...user };
    delete user.password;
    req.session.user = user;

    if (web) {
      return res.status(302).redirect("/products?loginSuccess=true");
    } else {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(200)
        .json({ payload: "Login correcto", username: user.name });
    }
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected error.`,
      detalle: `${error.message}`,
    });
  }
});

router4.get("/logout", async (req, res) => {
  try {
    req.session.destroy((e) => {
      if (e) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: `Unexpected error.`,
          detalle: `${error.message}`,
        });
      }
    });
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Logout successful." });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected error.`,
      detalle: `${error.message}`,
    });
  }
});
