const ProductManager = require("./productmanager");
const path = require("path");


const environment =async()=>{

const products = new ProductManager(path.join(__dirname, "file", "products.json"));

try{
    
console.log (await products.getProducts());

console.log (await products.addProduct());

console.log(await products.addProduct("producto prueba","este es un producto prueba", 200, "sin imagen", "abc123", 25));

console.log (await products.getProducts());

console.log (await products.addProduct("producto prueba2", "este es un producto prueba", 230, "sin imagen", "abc123", 15));

console.log (await products.getProductbyId(1));
console.log (await products.getProductbyId(5));

console.log (await products.addProduct( "producto prueba3","este es un producto prueba", 150, "sin imagen", "abc124", 20));

console.log (await products.addProduct( "producto prueba4","este es un producto prueba", 250, "sin imagen", "abc125", 10));

console.log (await products.getProducts());

console.log (await products.updateProduct(2, {title:"soy un producto actualizado"}));

console.log (await products.deleteProduct(3));

    }catch(error){
       console.log ("Error", error.message);
       return;
    }
}

environment();

