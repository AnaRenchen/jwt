const buy = async (pid) => {
  let inputCart = document.getElementById("cartId");
  let cid = inputCart.value;
  console.log(`Product id: ${pid}, Cart id: ${cid}`);

  let response = await fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "post",
  });
  if (response.status === 200) {
    let data = await response.json();
    console.log(data);
    Swal.fire({
      imageUrl: "https://i.postimg.cc/ZqrV8yL4/cat.png",
      text: "Product added to cart!",
      background: "#87a7ae",
      confirmButtonColor: "black",
      toast: true,
      timer: 2000,
    });
  }
};
