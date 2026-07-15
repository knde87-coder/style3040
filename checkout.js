const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");
const checkoutMessage = document.getElementById("checkout-message");

function getCheckoutItems() {
  return getGoodformCart();
}

function getCheckoutTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
}

function renderCheckout() {
  const items = getCheckoutItems();
  const total = getCheckoutTotal(items);
  if (!items.length) {
    checkoutItems.innerHTML = `<div class="empty-cart-state"><strong>주문할 상품이 없습니다.</strong><p>상품을 장바구니에 담은 뒤 주문을 진행해 주세요.</p><a class="button primary" href="/product-list?category=%EC%83%81%EC%9D%98">상품 보러가기</a></div>`;
    checkoutTotal.textContent = formatGoodformPrice(0);
    checkoutForm.querySelector('button[type="submit"]').disabled = true;
    checkoutMessage.textContent = "장바구니가 비어 있어 주문 저장을 할 수 없습니다.";
    return;
  }
  checkoutItems.innerHTML = items.map((item) => `
    <div class="cart-item checkout-item">
      <div class="cart-thumb tile-image ${item.imageClass || ""}" ${goodformImageStyle(item)}></div>
      <div><h3>${item.name}</h3><p>${item.color} / ${item.size} / 수량 ${item.quantity || 1}</p><small>${item.deliveryNotice || "영업일 기준 9~14일 소요"}</small></div>
      <strong>${formatGoodformPrice(Number(item.price || 0) * Number(item.quantity || 1))}</strong>
    </div>
  `).join("");
  checkoutTotal.textContent = formatGoodformPrice(total);
  checkoutForm.querySelector('button[type="submit"]').disabled = false;
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(checkoutForm);
  const items = getCheckoutItems();
  if (!items.length) return;
  const total = getCheckoutTotal(items);
  const currentUser = window.GoodformAuth?.getCurrentUser?.();
  const order = {
    id: `GF-${Date.now().toString(36).toUpperCase()}`,
    buyer: data.get("buyer"),
    phone: data.get("phone"),
    address: data.get("address"),
    memo: data.get("memo"),
    userId: currentUser?.id || "guest",
    items,
    total,
    status: "입금대기",
    paymentMethod: "무통장입금",
    createdAt: new Date().toISOString()
  };
  saveGoodformOrder(order);
  const fb = await window.goodformFirebase?.ready;
  if (fb?.enabled) await fb.saveOrder(order);
  clearGoodformCart();
  checkoutMessage.textContent = "주문이 저장됐습니다. 주문조회 화면에서 확인할 수 있습니다.";
  checkoutMessage.style.color = "#0e5a52";
  window.setTimeout(() => { window.location.href = "/orders"; }, 700);
});

renderCheckout();
