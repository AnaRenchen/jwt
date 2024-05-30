import jwt from "jsonwebtoken";
import { SECRET } from "../utils.js";

export const auth = (req, res, next) => {
  const token = req.cookies["anarenchencookie"];

  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.redirect("/login");
    }

    req.user = user;
    next();
  });
};
