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
  if (fb?.enabled) {
    const firebaseProducts = await fb.getProducts();
    if (firebaseProducts?.length) return firebaseProducts;
  }
  return getGoodformProducts();
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
  const visible = products.filter((product) => product.stockStatus !== "숨김");
  const matched = visible.filter((product) => matchesCategory(product, category));
  return matched.length ? matched : visible.slice(0, 6);
}

function categoryProductCard(product, index) {
  return `
    <article class="category-product-card">
      <a href="/product-detail" data-product-id="${product.id}">
        <div class="category-product-image tile-image ${product.imageClass || "tile-image-one"}" ${goodformImageStyle(product)}>
          ${index < 3 ? '<span class="mini-sale">SALE</span>' : ""}
        </div>
        <h3>${product.name}</h3>
        <div class="category-price"><strong>${product.priceText || formatGoodformPrice(product.price)}</strong><del>${product.comparePriceText || ""}</del></div>
        <div class="category-tags"><span>SALE</span><span>BEST</span><span>MD</span><span>HOT</span></div>
        <button class="tiny-cart" type="button" aria-label="장바구니">▱</button>
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

function applyCategoryUI(category) {
  document.title = `${category} 전체상품 | 비율좋은그사람`;
  document.getElementById("category-name-top").textContent = category;
  document.getElementById("category-name-list").textContent = category;
  document.querySelectorAll("#category-tabs a").forEach((link) => {
    link.classList.toggle("active", link.dataset.category === category);
  });
}

async function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const featured = document.getElementById("category-featured");
  if (!grid || !featured) return;
  const category = getCurrentCategory();
  const products = visibleProductsForCategory(await getCatalogProducts(), category);
  applyCategoryUI(category);
  featured.innerHTML = products.slice(0, 6).map(featuredProductCard).join("");
  grid.innerHTML = products.map(categoryProductCard).join("");
  document.querySelectorAll("[data-product-id]").forEach((link) => {
    link.addEventListener("click", () => selectGoodformProduct(link.dataset.productId));
  });
}

renderCatalog();
