const buy = async (pid, cid) => {
  try {
    if (!cid) {
      const response = await fetch("/api/carts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        cid = cartData._id;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    }

    const response = await fetch(`/api/carts/${cid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const cartData = await response.json();
      const existingProduct = cartData.products.find(
        (product) => product.product === pid
      );

      if (existingProduct) {
        const updatedQuantity = existingProduct.quantity + 1;
        await fetch(`/api/carts/${cid}/products/${pid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });
      } else {
        await fetch(`/api/carts/${cid}/product/${pid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      console.log("Product added to cart successfully!");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to add product to cart. Please try again later.");
  }
};

document.querySelectorAll(".btn_cart").forEach((button) => {
  button.addEventListener("click", async () => {
    const pid = button.id;
    let cid = button.dataset.cid;

    await buy(pid, cid);
    console.log(`Product ID: ${pid}, Cart ID: ${cid}`);
  });
});
