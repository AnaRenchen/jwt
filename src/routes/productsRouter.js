import { Router } from "express";
import ProductManager from "../dao/productmanager.js";
import __dirname from "../utils.js";
import path from "path";
export const router=Router();

const productsManager = new ProductManager(path.join(__dirname, "file", "products.json"));

router.get("/", async (req,res)=>{
    try{
    let products = await productsManager.getProducts();
    let limit = req.query.limit;

    if(!limit){
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(products);
    }

    limit=Number(limit);
    if(isNaN(limit)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"Limit must be a number."});
    }

    if(limit && limit>=0){
        products=products.slice(0,limit);
    }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json(products);

}catch (error){
    console.log(error)
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:"Internal server error."})
}
})

router.get("/:pid", async (req,res)=>{
try{
    let id = req.params.pid;
    id=Number(id);
    if(isNaN(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"Id must be a number."});
    }

    let product= await productsManager.getProductbyId(id);

    if(product){
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(product);
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`There are no products with id: ${id}`});
    }
}catch (error) {
    console.log(error)
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:"Internal server error."})
}
})

router.post("/", async (req,res)=>{
    try{
     let products = await productsManager.getProducts();
     let {title, description, category, price, status, thumbnail, code, stock}= req.body;

     if (!title || !description || !category || !price || !status || !thumbnail || !code || !stock) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`All fields are required: title, description, category, price, status, thumbnail, code, stock.`})
    }
   
    let codigorepetido = products.some(item => item.code == code);
    if (codigorepetido) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Product with code ${code} already exists.`})
    }
       
        let newProduct = await productsManager.addProduct(title, description, category, price, status, thumbnail, code, stock);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({message:"Product added.", newProduct});

    }catch(error){
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:"Internal server error."})
    }
})

router.put("/:pid", async(req,res)=>{
    try{
    let id = req.params.pid;

    id=Number(id);
    if(isNaN(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"Id must be a number."});
    }

    let {updateProperties}= req.body;

    if (!updateProperties) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Properties must be provided as: {updateProperties: {property:value}}." });
    }

    let validProperties = ["title", "description", "category", "price", "status", "thumbnail", "code", "stock"];
    let properties = Object.keys(updateProperties);
    let valid = properties.every(prop => validProperties.includes(prop));

    if (!valid) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `The properties you are trying to update are not valid or do not exist. Valid properties are: ${validProperties}.` });
    }

    let product = await productsManager.getProductbyId(id);
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ error: `Product with id ${id} was not found.` });
    }

    let updatedProduct = await productsManager.updateProduct(id, updateProperties);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({message: `Product with id ${id} was updated.`, updatedProduct});

}catch(error){
    console.log(error)
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:"Internal server error."})
}
})

router.delete ("/:pid", async(req,res)=>{
    try{
        let id = req.params.pid;
    
        id=Number(id);
        if(isNaN(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:"Id must be a number."});
        }

        let product = await productsManager.getProductbyId(id);
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Product with id ${id} was not found.` });
        }

        let deletedProduct =await productsManager.deleteProduct(id);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({ message: `Product with id ${id} was deleted.`, deletedProduct});

    }catch(error){
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:"Internal server error."})
    }
})
