import express from "express";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router2 as cartsRouter} from "./routes/cartsRouter.js";


const PORT = 3000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.listen(PORT, ()=>console.log(`Server online on ${PORT}`));