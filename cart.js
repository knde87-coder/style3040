function cartItems() {
  const cart = getGoodformCart();
  return cart.length ? cart : getGoodformProducts().slice(1, 3).map((product) => ({
    ...product,
    color: product.colors?.[0] || "기본",
    size: product.sizes?.[0] || "FREE",
    quantity: 1
  }));
}

function renderCart() {
  const list = document.getElementById("cart-list");
  const productTotal = document.getElementById("cart-product-total");
  const cartTotal = document.getElementById("cart-total");
  if (!list) return;
  const items = cartItems();
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  list.innerHTML = items.map((item, index) => `
    <div class="cart-item">
      <div class="cart-thumb tile-image ${item.imageClass || ""}" ${goodformImageStyle(item)}></div>
      <div>
        <h3>${item.name}</h3>
        <p>${item.color} / ${item.size} / 수량 ${item.quantity || 1}</p>
      </div>
      <strong>${formatGoodformPrice(Number(item.price || 0) * Number(item.quantity || 1))}</strong>
      <button class="cart-remove" type="button" data-cart-index="${index}">삭제</button>
    </div>
  `).join("");
  productTotal.textContent = formatGoodformPrice(total);
  cartTotal.textContent = formatGoodformPrice(total);
  list.querySelectorAll("[data-cart-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const cart = getGoodformCart();
      cart.splice(Number(button.dataset.cartIndex), 1);
      saveGoodformCart(cart);
      renderCart();
    });
  });
}

renderCart();
