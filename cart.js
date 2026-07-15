function cartItems() {
  return getGoodformCart();
}

function renderCart() {
  const list = document.getElementById("cart-list");
  const productTotal = document.getElementById("cart-product-total");
  const cartTotal = document.getElementById("cart-total");
  if (!list) return;
  const items = cartItems();
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);

  if (!items.length) {
    list.innerHTML = `<div class="empty-cart-state"><strong>장바구니가 비어 있습니다.</strong><p>마음에 드는 상품을 담으면 이곳에서 확인할 수 있습니다.</p><a class="button primary" href="/product-list?category=%EC%83%81%EC%9D%98">상품 보러가기</a></div>`;
  } else {
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
  }

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
