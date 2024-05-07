const socket = io();

let productsUpdate = document.getElementById("products");

socket.on("newproduct", (productsList) => {
  productsUpdate.innerHTML = "";
  productsList.forEach((p) => {
    productsUpdate.innerHTML += `
        <tr>
          <td>${p.title}</td>
          <td>${p.description}</td>
          <td>$${p.price}</td>
          <td>${p.code}</td>
          <td>${p.stock}</td>
          <td>${p.status}</td>
          <td>${p.category}</td>
          <td><img src=${p.thumbnail} alt="{{p.title}}" width="100" /></td>
        </tr>`;
  });
});

socket.on("deletedproduct", (products) => {
  productsUpdate.innerHTML = "";
  products.forEach((p) => {
    productsUpdate.innerHTML += `
      <tr>
        <td>${p.title}</td>
        <td>${p.description}</td>
        <td>$${p.price}</td>
        <td>${p.code}</td>
        <td>${p.stock}</td>
        <td>${p.status}</td>
        <td>${p.category}</td>
        <td><img src="${p.thumbnail}" alt="{{p.title}}" width="100" /></td>
      </tr>`;
  });
});
