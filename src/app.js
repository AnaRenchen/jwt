import express from "express";
import ProductManager from "./classes/productmanager.js"

const PORT = 3000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productsManager = new ProductManager("./src/file/products.json");


app.get("/", (req,res)=>{
    res.setHeader('Content-type', 'text/plain');
    res.status(200).send("Welcome!");
})

app.get("/products", async (req,res)=>{

    let products = await productsManager.getProducts();
    let limit = req.query.limit;

    if(!limit){
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(products);
    }

    limit=Number(limit);
    if(isNaN(limit)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"Limit must be a number"});
    }

    if(limit && limit>0){
        products=products.slice(0,limit);
    }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json(products);
})

app.get("/products/:pid", async (req,res)=>{

    let id = req.params.pid;
    id=Number(id);
    if(isNaN(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"Id must be a number"});
    }

    let product= await productsManager.getProductbyId(id);
    if(product){
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(product);
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`There are no products with id: ${id}`});
    }

})

app.get("*", (req,res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(404).json({message:"error 404 - page not found."})
})


app.listen(PORT, ()=>console.log(`Server online on ${PORT}`));