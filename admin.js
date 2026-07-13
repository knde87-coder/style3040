const ADMIN_AUTH_KEY = "goodform.admin.authenticated";
const adminLoginScreen = document.getElementById("admin-login-screen");
const adminApp = document.getElementById("admin-app");
const adminLoginForm = document.getElementById("admin-login-form");
const adminLoginId = document.getElementById("admin-login-id");
const adminLoginPassword = document.getElementById("admin-login-password");
const adminLoginMessage = document.getElementById("admin-login-message");
const adminLogoutButton = document.getElementById("admin-logout-button");

function setAdminLoggedIn(value) {
  sessionStorage.setItem(ADMIN_AUTH_KEY, value ? "true" : "false");
  if (adminLoginScreen) adminLoginScreen.hidden = value;
  if (adminApp) adminApp.hidden = !value;
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminLoginMessage.textContent = "로그인 확인 중입니다.";
    adminLoginMessage.style.color = "#46534d";

    try {
      const result = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: adminLoginId.value.trim(), password: adminLoginPassword.value })
      });

      if (!result.ok) {
        throw new Error("LOGIN_FAILED");
      }

      setAdminLoggedIn(true);
      adminLoginPassword.value = "";
      renderAdminProducts();
    } catch {
      adminLoginMessage.textContent = "관리자 아이디 또는 비밀번호가 맞지 않습니다.";
      adminLoginMessage.style.color = "#b42318";
      adminLoginPassword.value = "";
    }
  });
}

if (adminLogoutButton) {
  adminLogoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setAdminLoggedIn(false);
  });
}

setAdminLoggedIn(isAdminLoggedIn());
const adminForm = document.getElementById("admin-product-form");
const adminMessage = document.getElementById("admin-message");
const adminPreview = document.getElementById("admin-preview-list");
const imageInput = document.getElementById("product-image-input");
const imagePreview = document.getElementById("upload-original-preview");
const resetButton = document.getElementById("admin-reset-button");
const restoreButton = document.getElementById("admin-restore-button");
const statEls = {
  total: document.getElementById("admin-total-count"),
  active: document.getElementById("admin-active-count"),
  soldout: document.getElementById("admin-soldout-count"),
  hidden: document.getElementById("admin-hidden-count")
};
let pendingImageData = "";

function splitValues(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function setAdminMessage(text, tone = "success") {
  adminMessage.textContent = text;
  adminMessage.style.color = tone === "error" ? "#b42318" : "#0e5a52";
}

function getAdminProducts() {
  return getGoodformProducts();
}

function updateStats(products) {
  if (!statEls.total) return;
  statEls.total.textContent = products.length;
  statEls.active.textContent = products.filter((product) => product.stockStatus === "판매중").length;
  statEls.soldout.textContent = products.filter((product) => product.stockStatus === "품절").length;
  statEls.hidden.textContent = products.filter((product) => product.stockStatus === "숨김").length;
}

function fillForm(product) {
  adminForm.elements.id.value = product.id;
  adminForm.elements.name.value = product.name;
  adminForm.elements.price.value = product.priceText || formatGoodformPrice(product.price);
  adminForm.elements.category.value = product.category || "반팔/티셔츠";
  adminForm.elements.stockStatus.value = product.stockStatus || "판매중";
  adminForm.elements.aiStatus.value = product.aiStatus || "AI READY";
  adminForm.elements.colors.value = (product.colors || []).join(", ");
  adminForm.elements.sizes.value = (product.sizes || []).join(", ");
  adminForm.elements.description.value = product.description || "";
  adminForm.elements.summary.value = product.summary || "";
  pendingImageData = product.imageData || "";
  renderUploadPreview(product);
  setAdminMessage("상품 정보를 불러왔습니다. 수정 후 저장하면 바로 반영됩니다.");
  adminForm.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const product = getGoodformProduct(id);
  if (!window.confirm(`'${product.name}' 상품을 삭제할까요?`)) return;
  const next = getAdminProducts().filter((item) => item.id !== id);
  saveGoodformProducts(next.length ? next : GOODFORM_DEFAULT_PRODUCTS);
  if (isAdminLoggedIn()) {
  renderAdminProducts();
}
  setAdminMessage("상품을 삭제했습니다.");
}

function duplicateProduct(id) {
  const product = getGoodformProduct(id);
  const copy = {
    ...product,
    id: createGoodformId(`${product.name}-copy`),
    name: `${product.name} 복사본`,
    stockStatus: "숨김"
  };
  saveGoodformProducts([...getAdminProducts(), copy]);
  if (isAdminLoggedIn()) {
  renderAdminProducts();
}
  fillForm(copy);
  setAdminMessage("복사본을 만들었습니다. 수정 후 판매중으로 바꾸면 노출됩니다.");
}

function viewProduct(id) {
  selectGoodformProduct(id);
  window.open("/product-detail", "_blank", "noopener,noreferrer");
}

function resetForm() {
  adminForm.reset();
  adminForm.elements.id.value = "";
  pendingImageData = "";
  renderUploadPreview();
  setAdminMessage("새 상품 입력 상태입니다.");
}

function restoreDefaults() {
  if (!window.confirm("관리자에서 추가/수정한 상품을 초기 기본 상품으로 되돌릴까요?")) return;
  saveGoodformProducts(GOODFORM_DEFAULT_PRODUCTS);
  resetForm();
  if (isAdminLoggedIn()) {
  renderAdminProducts();
}
  setAdminMessage("기본 상품 목록으로 복구했습니다.");
}

function productRow(product) {
  const statusClass = product.stockStatus === "숨김" ? "muted" : product.stockStatus === "품절" ? "danger" : "active";
  return `
    <div class="admin-product-row">
      <div>
        <strong>${product.name}</strong>
        <span>${product.priceText || formatGoodformPrice(product.price)} · ${product.category} · <b class="status-${statusClass}">${product.stockStatus || "판매중"}</b> · ${product.aiStatus || "AI READY"}</span>
        <small>${product.summary || "목록 설명 없음"}</small>
      </div>
      <div class="admin-row-actions">
        <button type="button" data-view-id="${product.id}">보기</button>
        <button type="button" data-edit-id="${product.id}">수정</button>
        <button type="button" data-copy-id="${product.id}">복제</button>
        <button type="button" data-delete-id="${product.id}" class="danger-button">삭제</button>
      </div>
    </div>
  `;
}

function renderAdminProducts() {
  if (!adminPreview) return;
  const products = getAdminProducts();
  updateStats(products);
  adminPreview.innerHTML = products.length ? products.map(productRow).join("") : `<p class="empty-state">등록된 상품이 없습니다.</p>`;

  adminPreview.querySelectorAll("[data-view-id]").forEach((button) => {
    button.addEventListener("click", () => viewProduct(button.dataset.viewId));
  });
  adminPreview.querySelectorAll("[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => fillForm(getGoodformProduct(button.dataset.editId)));
  });
  adminPreview.querySelectorAll("[data-copy-id]").forEach((button) => {
    button.addEventListener("click", () => duplicateProduct(button.dataset.copyId));
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
    const name = String(data.get("name") || "").trim();
    const price = Number(String(data.get("price")).replace(/[^0-9]/g, "")) || 0;

    if (!name || !price) {
      setAdminMessage("상품명과 판매가는 반드시 입력해야 합니다.", "error");
      return;
    }

    const products = getAdminProducts();
    const existingId = data.get("id");
    const product = {
      id: existingId || createGoodformId(name),
      name,
      category: data.get("category"),
      stockStatus: data.get("stockStatus"),
      aiStatus: data.get("aiStatus"),
      price,
      priceText: formatGoodformPrice(price),
      summary: data.get("summary") || "핏과 비율을 살리는 남성 데일리웨어",
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
    if (isAdminLoggedIn()) {
  renderAdminProducts();
}
  });
}

if (resetButton) {
  resetButton.addEventListener("click", resetForm);
}

if (restoreButton) {
  restoreButton.addEventListener("click", restoreDefaults);
}

if (isAdminLoggedIn()) {
  renderAdminProducts();
}


