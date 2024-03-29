import ProductManager from "./src/dao/productmanager.js";

const environment =async()=>{

const products = new ProductManager("./src/file/products.json");

try{
    
console.log (await products.getProducts());

console.log(await products.addProduct("kiku","Original Painting A3 Size", 200, "sin imagen", "horisada1", 3));

console.log (await products.addProduct("unryu", "Original Painting A3 Size", 280, "sin imagen", "horisada2", 5));

console.log (await products.addProduct( "nyo","Original Painting A3 Size", 299, "sin imagen", "horisada3", 2));

console.log (await products.addProduct( "jiraya","Original Painting A3 Size", 300, "sin imagen", "horisada4", 3));

console.log (await products.addProduct( "kasha","Original Painting A3 Size", 190, "sin imagen", "horisada5", 5));

console.log (await products.addProduct( "karajishi","Original Painting A3 Size", 230, "sin imagen", "horisada6", 1));

console.log (await products.addProduct( "kingyo","Original Painting A3 Size", 290, "sin imagen", "horisada7", 3));

console.log (await products.addProduct( "kitsune","Original Painting A3 Size", 250, "sin imagen", "horisada8", 4));

console.log (await products.addProduct( "koyihime","Original Painting A3 Size", 380, "sin imagen", "horisada9", 3));

console.log (await products.addProduct( "botan","Original Painting A3 Size", 250, "sin imagen", "horisada10", 2));

console.log (await products.getProducts());

console.log(await products.getProductbyId(3));

} catch (error) {
    console.error(error);
  }
};

environment();

