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
let serverSocket;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine("handlebars", engine());
app.set("views", (path.join(__dirname,"views")));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname,"public")))


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const serverTTTP=app.listen(PORT, ()=>console.log(`Server online on ${PORT}`));

export default serverSocket = new Server(serverTTTP);


serverSocket.on("connection", socket=>{
    socket.emit("greeting", "Welcome!")
})