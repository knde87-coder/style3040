const CATEGORY_LABELS = ["상의", "하의", "외투", "상하세트", "신발", "ACC"];
const CATEGORY_MATCHERS = {
  상의: ["상의"],
  하의: ["하의", "팬츠"],
  외투: ["외투", "아우터"],
  상하세트: ["상하세트", "셋업"],
  신발: ["신발", "슈즈"],
  ACC: ["ACC", "액세서리"]
};

async function getCatalogProducts() {
  const fb = await window.goodformFirebase?.ready;
  const localProducts = getGoodformProducts();
  const source = Array.isArray(localProducts) ? [...localProducts] : [];
  if (fb?.enabled) {
    const firebaseProducts = await fb.getProducts();
    if (firebaseProducts?.length) source.unshift(...firebaseProducts);
  }
  const seen = new Set();
  return source.filter((product) => {
    if (!product?.id || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function getCurrentCategory() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "상의";
  return CATEGORY_LABELS.includes(category) ? category : "상의";
}

function matchesCategory(product, category) {
  const targets = CATEGORY_MATCHERS[category] || [category];
  return targets.includes(product.category);
}

function visibleProductsForCategory(products, category) {
  return products
    .filter((product) => product.stockStatus !== "숨김")
    .filter((product) => matchesCategory(product, category))
    .slice(0, 24);
}

function categoryProductCard(product, index) {
  const compare = product.comparePriceText ? `<del>${product.comparePriceText}</del>` : "";
  return `
    <article class="category-product-card">
      <a href="/product-detail" data-product-id="${product.id}">
        <div class="category-product-image tile-image ${product.imageClass || "tile-image-one"}" ${goodformImageStyle(product)}>
          ${index < 3 ? '<span class="mini-sale">SALE</span>' : ""}
        </div>
        <h3>${product.name}</h3>
        <p class="category-summary">${product.summary || "남성 데일리웨어"}</p>
        <div class="category-price"><strong>${product.priceText || formatGoodformPrice(product.price)}</strong>${compare}</div>
        <div class="category-tags"><span>SALE</span><span>BEST</span><span>MD</span><span>HOT</span></div>
      </a>
    </article>`;
}

function featuredProductCard(product) {
  return `
    <article class="category-featured-card">
      <a href="/product-detail" data-product-id="${product.id}">
        <div class="category-featured-image tile-image ${product.imageClass || "tile-image-one"}" ${goodformImageStyle(product)}></div>
        <h3>${product.name}</h3>
      </a>
    </article>`;
}

function applyCategoryUI(category, count) {
  document.title = `${category} 전체상품 | 비율좋은그남자`;
  document.getElementById("category-name-top").textContent = category;
  document.getElementById("category-name-list").textContent = category;
  const countEl = document.getElementById("category-count");
  if (countEl) countEl.textContent = `TOTAL ${count.toLocaleString("ko-KR")} PRODUCT`;
  document.querySelectorAll("#category-tabs a, .oz-category-tabs a").forEach((link) => {
    link.classList.toggle("active", link.dataset.category === category);
  });
}

async function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const featured = document.getElementById("category-featured");
  if (!grid || !featured) return;
  const category = getCurrentCategory();
  const products = visibleProductsForCategory(await getCatalogProducts(), category);
  applyCategoryUI(category, products.length);
  featured.innerHTML = products.slice(0, 6).map(featuredProductCard).join("");
  grid.innerHTML = products.length ? products.map(categoryProductCard).join("") : `<p class="empty-state">이 카테고리에 등록된 상품이 없습니다.</p>`;
  document.querySelectorAll("[data-product-id]").forEach((link) => {
    link.addEventListener("click", () => selectGoodformProduct(link.dataset.productId));
  });
}

renderCatalog();
