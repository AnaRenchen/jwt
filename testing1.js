const ProductManager = require("./productmanager");


const products = new ProductManager();

console.log (products.getProducts());

console.log (products.addProduct());

console.log(products.addProduct( "producto prueba","este es un producto prueba", 200, "sin imagen", "abc123", 25));

console.log (products.getProducts());

console.log (products.addProduct("producto prueba2", "este es un producto prueba", 230, "sin imagen", "abc123", 15));

console.log (products.getProductbyId(1));

console.log (products.addProduct( "producto prueba3","este es un producto prueba", 150, "sin imagen", "abc124", 20));

console.log (products.getProducts());

console.log (products.getProductbyId(2));

console.log (products.getProductbyId(3));

