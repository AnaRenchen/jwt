import { Router } from "express";
import CartsManager from "../dao/cartsmanager.js";
export const router2=Router();

const cartsmanager = new CartsManager ("./src/file/carts.json");

router2.post("/", async (req,res)=>{
    try{
    let newCart = await cartsmanager.createCart();
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(newCart);

    }catch(error){
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:"Internal server error."})
    }

})

router2.get("/:cid", async (req, res)=>{
    try{
        let id = req.params.cid;
        id=Number(id);
        if(isNaN(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:"Id must be a number."});
        }
    
        let products= await cartsmanager.getCartbyId(id);
    
        if(products){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json(products);
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`There are no carts with id: ${id}`});
        }
    }catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:"Internal server error."})
    }
    })
    

router2.post("/:cid/product/:pid", async (req,res)=>{
try{
    let cid = req.params.cid;
    let pid = req.params.pid;
    cid=Number(cid);
    pid=Number(pid);
        if(isNaN(cid) || isNaN(pid) ){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:"Id must be a number."});
        }

       
        const updatedCart = await cartsmanager.addProductCart (cid, pid);

        if(updatedCart){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({message:"Product added.",updatedCart});
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`There was an error updating cart.`});
        }

}catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:"Internal server error."})
    }
})