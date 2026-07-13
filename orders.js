const ordersList = document.getElementById("orders-list");

async function renderOrders() {
  const fb = await window.goodformFirebase?.ready;
  const orders = fb?.enabled ? await fb.getOrders() : getGoodformOrders();
  ordersList.innerHTML = orders.length ? orders.map((order) => `
    <article class="order-card">
      <div><span>${order.id}</span><h3>${order.buyer} · ${formatGoodformPrice(order.total)}</h3><p>${order.phone} / ${order.address}</p></div>
      <strong>${order.status}</strong>
      <p>${(order.items || []).map((item) => item.name).join(", ")}</p>
      <small>${order.createdAt || ""}</small>
    </article>
  `).join("") : '<article class="order-card"><h3>저장된 주문이 없습니다.</h3><p>주문서에서 주문 저장을 진행하면 이곳에 표시됩니다.</p></article>';
}

renderOrders();


