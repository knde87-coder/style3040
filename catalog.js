async function getCatalogProducts() {
  const fb = await window.goodformFirebase?.ready;
  if (fb?.enabled) {
    const firebaseProducts = await fb.getProducts();
    if (firebaseProducts?.length) return firebaseProducts;
  }
  return getGoodformProducts();
}

function productTile(product) {
  return `
    <article class="product-tile ${product.stockStatus === "숨김" ? "is-hidden-product" : ""}">
      <a class="tile-link" href="/product-detail" data-product-id="${product.id}">
        <div class="tile-image ${product.imageClass || ""}" ${goodformImageStyle(product)}></div>
        <h3>${product.name}</h3>
        <p>${product.summary}</p>
        <strong>${product.priceText || formatGoodformPrice(product.price)}</strong>
        <span class="ai-tag">${product.aiStatus || "AI MODEL"}</span>
      </a>
    </article>
  `;
}

async function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;
  const products = (await getCatalogProducts()).filter((product) => product.stockStatus !== "숨김");
  grid.innerHTML = products.map(productTile).join("");
  grid.querySelectorAll("[data-product-id]").forEach((link) => {
    link.addEventListener("click", () => selectGoodformProduct(link.dataset.productId));
  });
}

renderCatalog();



