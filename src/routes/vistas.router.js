import { Router } from "express";
import ProductManager from "../dao/productmanager.js";
import __dirname from "../utils.js";
import path from "path";
export const router3=Router();

const productsManager = new ProductManager(path.join(__dirname, "file", "products.json"));


router3.get("/home", async (req,res) =>{
    let products = await productsManager.getProducts();

    res.setHeader('Content-Type','text/html');
    res.status(200).render('home', {products, titulo: "Horisada"});
})

router3.get("/realtimeproducts", async (req,res) =>{
   
    let products = await productsManager.getProducts();

    res.setHeader('Content-Type','text/html');
    res.status(200).render("realTimeProducts",{products} );
})