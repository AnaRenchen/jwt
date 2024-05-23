const removeFromCart = async (pid) => {
  let inputCart = document.getElementById("cartId");
  let cid = inputCart.value;
  console.log(`Product id: ${pid}, Cart id: ${cid}`);

  let response = await fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "delete",
  });
  if (response.status === 200) {
    let data = await response.json();
    console.log(data);
    Swal.fire({
      text: "Product removed!",
      background: "#87a7ae",
      confirmButtonColor: "black",
      toast: true,
      timer: 2000,
      toast: true,
    }).then(() => {
      location.reload();
    });
  }
};
