import mongoose from "mongoose";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema(
  {
    products: [{ _id: false, pid: String, quantity: Number }],
  },
  {
    timestamps: true,
  }
);

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
