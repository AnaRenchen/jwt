const socket = io();

let ulProducts=document.getElementById("products")

socket.on("newproduct", (title, code) => {
    ulProducts.innerHTML+=`
    <div class="product">
    <li>Name: ${title}</li>
    <li>Code: ${code}</li>
    </div>
    `
});

socket.on("deletedproduct", products => {
    ulProducts.innerHTML=""
    products.forEach(product=>{
        ulProducts.innerHTML+=`
        <div class="product">
        <li>Name: ${product.title}</li>
        <li>Code: ${product.code}</li>
        </div>
        `
    })
});


