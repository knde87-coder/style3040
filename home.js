function marketProductCard(product, index) {
  const rank = String(index + 1).padStart(2, "0");
  const comparePrice = product.comparePriceText || formatGoodformPrice(Math.round((product.price || 0) * 1.25));
  return `
    <article class="market-product-card">
      <a href="/product-detail" data-product-id="${product.id}">
        <div class="market-product-image tile-image ${product.imageClass || "tile-image-one"}" ${goodformImageStyle(product)}>
          <span class="rank-badge">${rank}</span>
          ${product.stockStatus === "품절" ? '<span class="soldout-badge">SOLD OUT</span>' : ""}
        </div>
        <h3>${product.name}</h3>
        <p>${product.summary || product.category || "남성 데일리웨어"}</p>
        <div class="market-price-row">
          <strong>${product.priceText || formatGoodformPrice(product.price)}</strong>
          <del>${comparePrice}</del>
        </div>
      </a>
    </article>`;
}

function renderMarketHome() {
  const products = getGoodformProducts();
  const visibleProducts = products.filter((product) => product.stockStatus !== "숨김");
  const popular = visibleProducts.slice(0, 8);
  const newest = visibleProducts.slice().reverse().slice(0, 8);
  document.getElementById("popular-products").innerHTML = popular.map(marketProductCard).join("");
  document.getElementById("new-products").innerHTML = newest.map(marketProductCard).join("");
  document.querySelectorAll("[data-product-id]").forEach((link) => {
    link.addEventListener("click", () => selectGoodformProduct(link.dataset.productId));
  });
}

renderMarketHome();

