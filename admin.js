const adminForm = document.getElementById("admin-product-form");
const adminMessage = document.getElementById("admin-message");
const adminPreview = document.getElementById("admin-preview-list");
const imageInput = document.getElementById("product-image-input");
const imagePreview = document.getElementById("upload-original-preview");
const resetButton = document.getElementById("admin-reset-button");
let pendingImageData = "";

function splitValues(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function setAdminMessage(text, tone = "success") {
  adminMessage.textContent = text;
  adminMessage.style.color = tone === "error" ? "#b42318" : "#0e5a52";
}

function fillForm(product) {
  adminForm.elements.id.value = product.id;
  adminForm.elements.name.value = product.name;
  adminForm.elements.price.value = product.priceText || formatGoodformPrice(product.price);
  adminForm.elements.category.value = product.category || "상의";
  adminForm.elements.stockStatus.value = product.stockStatus || "판매중";
  adminForm.elements.aiStatus.value = product.aiStatus || "AI READY";
  adminForm.elements.colors.value = (product.colors || []).join(", ");
  adminForm.elements.sizes.value = (product.sizes || []).join(", ");
  adminForm.elements.description.value = product.description || "";
  adminForm.elements.summary.value = product.summary || "";
  pendingImageData = product.imageData || "";
  renderUploadPreview(product);
  setAdminMessage("상품 정보를 불러왔습니다. 수정 후 저장하면 반영됩니다.");
}

function renderUploadPreview(product = {}) {
  if (!imagePreview) return;
  if (pendingImageData || product.imageData) {
    imagePreview.style.backgroundImage = `linear-gradient(180deg, rgba(20,20,20,0.04), rgba(20,20,20,0.42)), url('${pendingImageData || product.imageData}')`;
  } else {
    imagePreview.style.backgroundImage = "";
  }
}

function deleteProduct(id) {
  const next = getGoodformProducts().filter((product) => product.id !== id);
  saveGoodformProducts(next.length ? next : GOODFORM_DEFAULT_PRODUCTS);
  renderAdminProducts();
  setAdminMessage("상품을 삭제했습니다.");
}

async function getAdminProducts() {
  const fb = await window.goodformFirebase?.ready;
  if (fb?.enabled) {
    const firebaseProducts = await fb.getProducts();
    if (firebaseProducts?.length) return firebaseProducts;
  }
  return getGoodformProducts();
}

async function renderAdminProducts() {
  if (!adminPreview) return;
  const products = getGoodformProducts();
  adminPreview.innerHTML = products.map((product) => `
    <div class="admin-product-row">
      <div>
        <strong>${product.name}</strong>
        <span>${product.priceText || formatGoodformPrice(product.price)} · ${product.category} · ${product.stockStatus || "판매중"} · ${product.aiStatus || "AI READY"}</span>
      </div>
      <div class="admin-row-actions">
        <button type="button" data-edit-id="${product.id}">수정</button>
        <button type="button" data-delete-id="${product.id}">삭제</button>
      </div>
    </div>
  `).join("");

  adminPreview.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => fillForm(getGoodformProduct(button.dataset.editId)));
  });
  adminPreview.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => deleteProduct(button.dataset.deleteId));
  });
}

if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      pendingImageData = String(reader.result || "");
      renderUploadPreview({ imageData: pendingImageData });
      setAdminMessage("이미지가 준비됐습니다. 상품 저장을 누르면 함께 반영됩니다.");
    });
    reader.readAsDataURL(file);
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(adminForm);
    const name = data.get("name");
    const price = Number(String(data.get("price")).replace(/[^0-9]/g, "")) || 0;
    const products = getGoodformProducts();
    const existingId = data.get("id");
    const product = {
      id: existingId || createGoodformId(name),
      name,
      category: data.get("category"),
      stockStatus: data.get("stockStatus"),
      aiStatus: data.get("aiStatus"),
      price,
      priceText: formatGoodformPrice(price),
      summary: data.get("summary") || "AI 모델 착장으로 확인하는 신상품",
      description: data.get("description"),
      colors: splitValues(data.get("colors")),
      sizes: splitValues(data.get("sizes")),
      imageClass: pendingImageData ? "" : "tile-image-three",
      imageData: pendingImageData,
      fit: { 어깨: "CLEAN", 가슴: "REGULAR", 밑단: "SOFT", 기장: "STANDARD" }
    };
    const next = existingId ? products.map((item) => item.id === existingId ? product : item) : [...products, product];
    saveGoodformProducts(next);
    selectGoodformProduct(product.id);
    setAdminMessage(existingId ? "상품 수정이 완료됐습니다." : "상품이 저장됐습니다. 상품목록과 상세페이지에서 바로 확인할 수 있습니다.");
    renderAdminProducts();
  });
}

if (resetButton) {
  resetButton.addEventListener("click", () => {
    adminForm.reset();
    adminForm.elements.id.value = "";
    pendingImageData = "";
    renderUploadPreview();
    setAdminMessage("새 상품 입력 상태입니다.");
  });
}

renderAdminProducts();



