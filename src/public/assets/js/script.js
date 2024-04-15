const socket = io();

let productsUpdate=document.getElementById("products")

socket.on("newproduct", (productsList) => {
    productsUpdate.innerHTML="";
        productsUpdate.innerHTML += `
        <tr>
          <td>${productsList.title}</td>
          <td>${productsList.description}</td>
          <td>${productsList.price}</td>
          <td>${productsList.code}</td>
          <td>${productsList.stock}</td>
          <td>${productsList.status}</td>
          <td>${productsList.category}</td>
        </tr>`;
});

socket.on("deletedproduct", (products) => {
    productsUpdate.innerHTML="";
        productsUpdate.innerHTML += `
        <tr>
          <td>${products.title}</td>
          <td>${products.description}</td>
          <td>${products.price}</td>
          <td>${products.code}</td>
          <td>${products.stock}</td>
          <td>${products.status}</td>
          <td>${products.category}</td>
        </tr>`;
});


