const createCart = async () => {
  try {
    const response = await fetch("/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const cartData = await response.json();
      return cartData._id;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to create a new cart. Please try again later.");
    return null;
  }
};

const buy = async (pid, cid) => {
  try {
    if (!cid) {
      // Si no hay un ID de carrito, crear uno nuevo
      cid = await createCart();
      if (!cid) return; // Si no se puede crear un carrito, salir de la función
    }

    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Product added to cart successfully!");
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
    let cid = button.dataset.cid; // Obtener el ID del carrito desde el botón
    await buy(pid, cid);
    console.log(`Product ID: ${pid}, Cart ID: ${cid}`);
  });
});
