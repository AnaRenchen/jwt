import mongoose from "mongoose";

const usersCollection = "users";
const usersSchema = new mongoose.Schema(
  new mongoose.Schema({
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    rol: {
      type: String,
      default: "user",
    },
  })
);

export const usersModel = mongoose.model(usersCollection, usersSchema);
