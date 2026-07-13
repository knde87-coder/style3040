const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");
const checkoutMessage = document.getElementById("checkout-message");

function getCheckoutItems() {
  const cart = getGoodformCart();
  return cart.length ? cart : getGoodformProducts().slice(0, 1).map((product) => ({
    ...product,
    color: product.colors?.[0] || "기본",
    size: product.sizes?.[0] || "FREE",
    quantity: 1
  }));
}

function renderCheckout() {
  const items = getCheckoutItems();
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  checkoutItems.innerHTML = items.map((item) => `
    <div class="cart-item checkout-item">
      <div class="cart-thumb tile-image ${item.imageClass || ""}" ${goodformImageStyle(item)}></div>
      <div><h3>${item.name}</h3><p>${item.color} / ${item.size} / 수량 ${item.quantity || 1}</p></div>
      <strong>${formatGoodformPrice(Number(item.price || 0) * Number(item.quantity || 1))}</strong>
    </div>
  `).join("");
  checkoutTotal.textContent = formatGoodformPrice(total);
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(checkoutForm);
  const items = getCheckoutItems();
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const order = {
    id: `GF-${Date.now().toString(36).toUpperCase()}`,
    buyer: data.get("buyer"),
    phone: data.get("phone"),
    address: data.get("address"),
    memo: data.get("memo"),
    items,
    total,
    status: "결제대기",
    createdAt: new Date().toLocaleString("ko-KR")
  };
  saveGoodformOrder(order);
  const fb = await window.goodformFirebase?.ready;
  if (fb?.enabled) await fb.saveOrder(order);
  clearGoodformCart();
  checkoutMessage.textContent = "주문이 저장됐습니다. 주문관리 화면에서 확인할 수 있습니다.";
  checkoutMessage.style.color = "#0e5a52";
});

renderCheckout();
