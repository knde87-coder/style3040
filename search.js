const input = document.getElementById("search-input");
const results = document.getElementById("search-results");

function renderSearch() {
  const q = input.value.trim().toLowerCase();
  const products = getGoodformProducts().filter((product) => {
    const haystack = [product.name, product.category, product.summary, product.description, ...(product.colors || []), ...(product.sizes || [])].join(" ").toLowerCase();
    return !q || haystack.includes(q);
  });
  results.innerHTML = products.map((product) => `
    <article class="product-tile">
      <a class="tile-link" href="/product-detail" data-product-id="${product.id}">
        <div class="tile-image ${product.imageClass || ""}" ${goodformImageStyle(product)}></div>
        <h3>${product.name}</h3>
        <p>${product.summary}</p>
        <strong>${product.priceText || formatGoodformPrice(product.price)}</strong>
        <span class="ai-tag">${product.aiStatus || "AI MODEL"}</span>
      </a>
    </article>
  `).join("") || '<p class="empty-state">검색 결과가 없습니다.</p>';
  results.querySelectorAll("[data-product-id]").forEach((link) => link.addEventListener("click", () => selectGoodformProduct(link.dataset.productId)));
}

input.addEventListener("input", renderSearch);
document.querySelectorAll("[data-search-chip]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-search-chip]").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    input.value = button.dataset.searchChip;
    renderSearch();
  });
});
renderSearch();



