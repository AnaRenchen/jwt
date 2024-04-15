import express from "express";
import {Server} from "socket.io";
import {engine} from "express-handlebars";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router2 as cartsRouter} from "./routes/cartsRouter.js";
import { router3 as viewsRouter } from "./routes/vistas.router.js";
import __dirname from "./utils.js";
import path from "path";


const PORT = 3000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine("handlebars", engine());
app.set("views", (path.join(__dirname,"views")));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname,"public")))


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const server=app.listen(PORT, ()=>console.log(`Server online on ${PORT}`));

export const io = new Server(server);

io.on("connection", socket=>{
    console.log(`A cliente with id ${socket.id} is connected.`)
})
