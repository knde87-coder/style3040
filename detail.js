function chipList(items, type) {
  return (items || ["기본"]).map((item, index) => `<button class="market-select-chip ${index === 0 ? "active" : ""}" type="button" data-${type}="${item}">${item}</button>`).join("");
}

function renderFit(product) {
  const fit = product.fit || {};
  const entries = Object.entries(fit).length ? Object.entries(fit) : [["핏", "REGULAR"], ["기장", "STANDARD"], ["무드", "CLEAN"], ["착용감", "SOFT"]];
  return entries.slice(0, 4).map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function setProductImage(el, product, extraClass = "") {
  el.className = `${extraClass} tile-image ${product.imageClass || "tile-image-one"}`.trim();
  if (product.imageData) {
    el.style.backgroundImage = `linear-gradient(180deg, rgba(20,20,20,0.02), rgba(20,20,20,0.18)), url('${product.imageData}')`;
  }
}

function renderDetailStack(product) {
  const stack = document.getElementById("detail-stack");
  if (!stack) return;
  const related = [product, { imageClass: "tile-image-pocket-shirt" }, { imageClass: "tile-image-linen-set" }, { imageClass: "tile-image-three" }];
  stack.innerHTML = related.map((item, index) => `
    <figure class="detail-stack-card">
      <div class="detail-stack-image tile-image ${item.imageClass || product.imageClass || "tile-image-one"}" ${goodformImageStyle(item)}></div>
      <figcaption>${index === 0 ? product.name : "컬러 및 착장 참고 이미지"}</figcaption>
    </figure>`).join("");
}

function renderDetail() {
  const product = getSelectedGoodformProduct();
  if (!product) return;
  document.title = `${product.name} | 비율좋은그남자`;
  document.getElementById("detail-name").textContent = product.name;
  document.getElementById("detail-price").textContent = product.priceText || formatGoodformPrice(product.price);
  const compare = document.getElementById("detail-compare");
  if (compare) compare.textContent = product.comparePriceText || "";
  document.getElementById("detail-copy").textContent = product.description || product.summary;
  const code = document.getElementById("detail-code");
  if (code) code.textContent = `${product.category || "GOODFORM"} / ${product.aiStatus || "READY"}`;
  setProductImage(document.getElementById("detail-main-image"), product, "market-detail-main");
  document.getElementById("detail-thumbs").innerHTML = [product, { imageClass: "tile-image-pocket-shirt" }, { imageClass: "tile-image-linen-set" }].map((item) => `<div class="detail-thumb tile-image ${item.imageClass || product.imageClass || ""}" ${goodformImageStyle(item)}></div>`).join("");
  document.getElementById("color-options").innerHTML = chipList(product.colors, "color");
  document.getElementById("size-options").innerHTML = chipList(product.sizes, "size");
  document.getElementById("fit-meter-grid").innerHTML = renderFit(product);
  renderDetailStack(product);
  document.querySelectorAll(".market-select-chip").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.querySelectorAll(".market-select-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
    });
  });
  document.querySelectorAll("[data-cart-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const color = document.querySelector("[data-color].active")?.dataset.color;
      const size = document.querySelector("[data-size].active")?.dataset.size;
      addGoodformCartItem(product, { color, size });
      window.location.href = button.dataset.cartAction === "buy" ? "/checkout" : "/cart";
    });
  });
}

renderDetail();

