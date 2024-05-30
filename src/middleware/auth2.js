import jwt from "jsonwebtoken";
import { SECRET } from "../utils.js";

export const auth2 = (req, res, next) => {
  const token = req.cookies.anarenchencookie;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  });
};
