function chipList(items, type) {
  return (items || ["기본"]).map((item, index) => `<button class="filter-chip ${index === 0 ? "active" : ""}" type="button" data-${type}="${item}">${item}</button>`).join("");
}

function renderFit(product) {
  const fit = product.fit || {};
  const entries = Object.entries(fit).length ? Object.entries(fit) : [["핏", "REGULAR"], ["기장", "STANDARD"], ["무드", "CLEAN"], ["착용감", "SOFT"]];
  return entries.slice(0, 4).map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function setImage(el, product, fallbackClass = "tile-image-one") {
  el.className = `detail-main-image tile-image ${product.imageClass || fallbackClass}`;
  if (product.imageData) {
    el.style.backgroundImage = `linear-gradient(180deg, rgba(20,20,20,0.02), rgba(20,20,20,0.34)), url('${product.imageData}')`;
  }
}

function renderDetail() {
  const product = getSelectedGoodformProduct();
  if (!product) return;
  document.title = `${product.name} | 비율좋은그사람`;
  document.getElementById("detail-name").textContent = product.name;
  document.getElementById("detail-price").textContent = product.priceText || formatGoodformPrice(product.price);
  document.getElementById("detail-copy").textContent = product.description || product.summary;
  setImage(document.getElementById("detail-main-image"), product, "tile-image-one");
  document.getElementById("detail-thumbs").innerHTML = [product, { imageClass: "tile-image-three" }, { imageClass: "tile-image-one" }].map((item) => `<div class="detail-thumb tile-image ${item.imageClass || ""}" ${goodformImageStyle(item)}></div>`).join("");
  document.getElementById("color-options").innerHTML = chipList(product.colors, "color");
  document.getElementById("size-options").innerHTML = chipList(product.sizes, "size");
  document.getElementById("fit-meter-grid").innerHTML = renderFit(product);
  document.querySelectorAll(".option-box .filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
    });
  });
  document.querySelectorAll("[data-cart-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const color = document.querySelector("[data-color].active")?.dataset.color;
      const size = document.querySelector("[data-size].active")?.dataset.size;
      addGoodformCartItem(product, { color, size });
      window.location.href = button.dataset.cartAction === "buy" ? "checkout.html" : "cart.html";
    });
  });
}

renderDetail();
