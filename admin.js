const ADMIN_AUTH_KEY = "goodform.admin.authenticated";
const LOCAL_ADMIN_ID = "roadtotheje";
const LOCAL_ADMIN_PASSWORD = "5469dltkdqja^!A";
const ADMIN_USERS_KEY = "goodform.users";
const ADMIN_NOTICES_KEY = "goodform.admin.notices";
const ADMIN_BANNERS_KEY = "goodform.admin.banners";

function canUseLocalAdminLogin() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function isLocalAdminCredential(adminId, password) {
  return canUseLocalAdminLogin() && adminId === LOCAL_ADMIN_ID && password === LOCAL_ADMIN_PASSWORD;
}

function readAdminJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeAdminJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function safeAdminDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("ko-KR");
}

const adminLoginScreen = document.getElementById("admin-login-screen");
const adminApp = document.getElementById("admin-app");
const adminLoginForm = document.getElementById("admin-login-form");
const adminLoginId = document.getElementById("admin-login-id");
const adminLoginPassword = document.getElementById("admin-login-password");
const adminLoginMessage = document.getElementById("admin-login-message");
const adminLogoutButton = document.getElementById("admin-logout-button");
const adminPanels = Array.from(document.querySelectorAll("[data-admin-panel]"));
const adminNavLinks = Array.from(document.querySelectorAll("[data-admin-section]"));
const adminCurrentTitle = document.getElementById("admin-current-title");
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
const adminSectionTitles = {
  dashboard: "관리자 대시보드",
  products: "상품 등록·수정·삭제",
  categories: "카테고리 관리",
  inventory: "옵션·재고 관리",
  orders: "주문·배송 관리",
  users: "회원 관리",
  reviews: "공지·문의 관리",
  banners: "배너·공지 관리",
  stats: "매출·운영 설정"
};
let pendingImageData = "";

function getAdminSectionFromPath() {
  const path = window.location.pathname;
  if (path === "/admin" || path === "/admin/dashboard") return "dashboard";
  if (path === "/admin/posts" || path === "/admin/products") return "products";
  if (path === "/admin/notices") return "reviews";
  if (path === "/admin/orders") return "orders";
  if (path === "/admin/settings") return "stats";
  const last = path.split("/").filter(Boolean).pop();
  return adminSectionTitles[last] ? last : "dashboard";
}

function showAdminSection(section = getAdminSectionFromPath()) {
  adminPanels.forEach((panel) => {
    panel.hidden = panel.dataset.adminPanel !== section;
  });
  adminNavLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.adminSection === section);
  });
  if (adminCurrentTitle) adminCurrentTitle.textContent = adminSectionTitles[section] || adminSectionTitles.dashboard;
  renderAdminSupportPanels();
}

function setAdminLoggedIn(value) {
  sessionStorage.setItem(ADMIN_AUTH_KEY, value ? "true" : "false");
  if (adminLoginScreen) adminLoginScreen.hidden = value;
  if (adminApp) adminApp.hidden = !value;
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

function splitValues(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function setAdminMessage(text, tone = "success") {
  if (!adminMessage) return;
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

function renderUploadPreview(product = {}) {
  if (!imagePreview) return;
  if (pendingImageData || product.imageData) {
    imagePreview.style.backgroundImage = `linear-gradient(180deg, rgba(20,20,20,0.04), rgba(20,20,20,0.42)), url('${pendingImageData || product.imageData}')`;
  } else {
    imagePreview.style.backgroundImage = "";
  }
}

function fillForm(product) {
  if (!adminForm || !product) return;
  adminForm.elements.id.value = product.id;
  adminForm.elements.name.value = product.name;
  adminForm.elements.price.value = product.priceText || formatGoodformPrice(product.price);
  adminForm.elements.category.value = product.category || "상의";
  adminForm.elements.stockStatus.value = product.stockStatus || "판매중";
  adminForm.elements.aiStatus.value = product.aiStatus || "AI 모델컷";
  adminForm.elements.colors.value = (product.colors || []).join(", ");
  adminForm.elements.sizes.value = (product.sizes || []).join(", ");
  adminForm.elements.description.value = product.description || "";
  adminForm.elements.summary.value = product.summary || "";
  pendingImageData = product.imageData || "";
  renderUploadPreview(product);
  setAdminMessage("상품 정보를 불러왔습니다. 수정 후 저장하면 사용자 화면에 반영됩니다.");
  adminForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteProduct(id) {
  const product = getGoodformProduct(id);
  if (!window.confirm(`'${product.name}' 상품을 삭제할까요?`)) return;
  const next = getAdminProducts().filter((item) => item.id !== id);
  saveGoodformProducts(next.length ? next : GOODFORM_DEFAULT_PRODUCTS);
  const fb = await window.goodformFirebase?.ready;
  if (fb?.enabled) await fb.deleteProduct(id);
  renderAdminProducts();
  setAdminMessage("상품을 삭제했습니다.");
}

function duplicateProduct(id) {
  const product = getGoodformProduct(id);
  const copy = normalizeGoodformProduct({ ...product, id: createGoodformId(`${product.name}-copy`), name: `${product.name} 복사본`, stockStatus: "숨김" });
  saveGoodformProducts([...getAdminProducts(), copy]);
  renderAdminProducts();
  fillForm(copy);
  setAdminMessage("복사본을 만들었습니다. 수정 후 판매중으로 바꾸면 노출됩니다.");
}

function viewProduct(id) {
  selectGoodformProduct(id);
  window.open("/product-detail", "_blank", "noopener,noreferrer");
}

function resetForm() {
  if (!adminForm) return;
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
  renderAdminProducts();
  setAdminMessage("기본 상품 목록으로 복구했습니다.");
}

function productRow(product) {
  const statusClass = product.stockStatus === "숨김" ? "muted" : product.stockStatus === "품절" ? "danger" : "active";
  return `
    <div class="admin-product-row">
      <div class="admin-product-thumb tile-image ${product.imageClass || ""}" ${goodformImageStyle(product)}></div>
      <div>
        <strong>${product.name}</strong>
        <span>${product.priceText || formatGoodformPrice(product.price)} · ${product.category} · <b class="status-${statusClass}">${product.stockStatus || "판매중"}</b> · ${product.aiStatus || "READY"}</span>
        <small>${product.summary || "목록 설명 없음"}</small>
      </div>
      <div class="admin-row-actions">
        <button type="button" data-view-id="${product.id}">보기</button>
        <button type="button" data-edit-id="${product.id}">수정</button>
        <button type="button" data-copy-id="${product.id}">복제</button>
        <button type="button" data-delete-id="${product.id}" class="danger-button">삭제</button>
      </div>
    </div>`;
}

function renderAdminProducts() {
  if (!adminPreview) return;
  const products = getAdminProducts();
  updateStats(products);
  adminPreview.innerHTML = products.length ? products.map(productRow).join("") : `<p class="empty-state">등록된 상품이 없습니다.</p>`;
  adminPreview.querySelectorAll("[data-view-id]").forEach((button) => button.addEventListener("click", () => viewProduct(button.dataset.viewId)));
  adminPreview.querySelectorAll("[data-edit-id]").forEach((button) => button.addEventListener("click", () => fillForm(getGoodformProduct(button.dataset.editId))));
  adminPreview.querySelectorAll("[data-copy-id]").forEach((button) => button.addEventListener("click", () => duplicateProduct(button.dataset.copyId)));
  adminPreview.querySelectorAll("[data-delete-id]").forEach((button) => button.addEventListener("click", () => deleteProduct(button.dataset.deleteId)));
}

function renderAdminOrders() {
  const target = document.getElementById("admin-order-list");
  if (!target) return;
  const orders = readAdminJson("goodform.orders", []);
  target.innerHTML = orders.length ? orders.map((order) => `
    <div class="admin-product-row"><div><strong>${order.id || "주문번호 없음"}</strong><span>${order.buyer || order.customerName || "비회원"} · ${order.status || "주문 접수"}</span><small>${safeAdminDate(order.createdAt)} · ${formatGoodformPrice(order.total || 0)}</small></div></div>
  `).join("") : `<p class="empty-state">아직 저장된 주문이 없습니다.</p>`;
}

function renderAdminUsers() {
  const target = document.getElementById("admin-user-list");
  if (!target) return;
  const users = readAdminJson(ADMIN_USERS_KEY, []);
  target.innerHTML = users.length ? users.map((user) => `
    <div class="admin-product-row"><div><strong>${user.name || user.id}</strong><span>${user.id} · role: ${user.role || "customer"}</span><small>${user.provider === "kakao" ? "카카오톡 가입" : "ID/PW 가입"} · ${safeAdminDate(user.joinedAt)}</small></div></div>
  `).join("") : `<p class="empty-state">아직 가입한 일반 회원이 없습니다.</p>`;
}

function renderAdminNotices() {
  const list = document.getElementById("admin-notice-list");
  if (!list) return;
  const notices = readAdminJson(ADMIN_NOTICES_KEY, []);
  list.innerHTML = notices.length ? notices.map((notice, index) => `
    <div class="admin-product-row"><div><strong>${notice.title}</strong><span>${notice.body}</span><small>${safeAdminDate(notice.createdAt)}</small></div><div class="admin-row-actions"><button type="button" data-delete-notice="${index}" class="danger-button">삭제</button></div></div>
  `).join("") : `<p class="empty-state">등록된 공지가 없습니다.</p>`;
  list.querySelectorAll("[data-delete-notice]").forEach((button) => {
    button.addEventListener("click", () => {
      writeAdminJson(ADMIN_NOTICES_KEY, notices.filter((_, index) => String(index) !== button.dataset.deleteNotice));
      renderAdminNotices();
    });
  });
}

function renderAdminBanners() {
  const banners = readAdminJson(ADMIN_BANNERS_KEY, { top: "신규 회원 전 상품 무료배송", kakao: "카카오톡 주문상담", app: "어플 다운 받고 편리한 쇼핑" });
  const top = document.getElementById("admin-top-banner");
  const kakao = document.getElementById("admin-kakao-banner");
  const app = document.getElementById("admin-app-banner");
  if (top) top.value = banners.top || "";
  if (kakao) kakao.value = banners.kakao || "";
  if (app) app.value = banners.app || "";
}

function renderAdminStatsPanel() {
  const target = document.getElementById("admin-stats-list");
  if (!target) return;
  const products = getAdminProducts();
  const users = readAdminJson(ADMIN_USERS_KEY, []);
  const orders = readAdminJson("goodform.orders", []);
  target.innerHTML = `
    <div class="admin-product-row"><div><strong>상품 운영</strong><span>전체 ${products.length}개 · 판매중 ${products.filter((item) => item.stockStatus !== "숨김").length}개</span></div></div>
    <div class="admin-product-row"><div><strong>회원 운영</strong><span>가입 회원 ${users.length}명</span></div></div>
    <div class="admin-product-row"><div><strong>주문 운영</strong><span>저장 주문 ${orders.length}건</span></div></div>`;
}

function renderAdminSupportPanels() {
  renderAdminOrders();
  renderAdminUsers();
  renderAdminNotices();
  renderAdminBanners();
  renderAdminStatsPanel();
}

adminNavLinks.forEach((link) => link.addEventListener("click", () => showAdminSection(link.dataset.adminSection)));

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminLoginMessage.textContent = "로그인 확인 중입니다.";
    adminLoginMessage.style.color = "#46534d";
    try {
      let loggedIn = false;
      if (isLocalAdminCredential(adminLoginId.value.trim(), adminLoginPassword.value)) {
        loggedIn = true;
      } else {
        const result = await fetch("/api/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId: adminLoginId.value.trim(), password: adminLoginPassword.value })
        });
        loggedIn = result.ok;
      }
      if (!loggedIn) throw new Error("LOGIN_FAILED");
      setAdminLoggedIn(true);
      adminLoginPassword.value = "";
      showAdminSection();
      renderAdminProducts();
    } catch (error) {
      adminLoginMessage.textContent = "관리자 아이디 또는 비밀번호를 확인해 주세요.";
      adminLoginMessage.style.color = "#b42318";
    }
  });
}

if (adminLogoutButton) {
  adminLogoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setAdminLoggedIn(false);
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
    const product = normalizeGoodformProduct({
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
      deliveryNotice: "중국 제작 오더 상품으로 영업일 기준 9~14일 정도 소요될 수 있습니다.",
      fit: { 어깨: "CLEAN", 가슴: "REGULAR", 밑단: "SOFT", 기장: "STANDARD" }
    });
    const next = existingId ? products.map((item) => item.id === existingId ? product : item) : [...products, product];
    saveGoodformProducts(next);
    const fb = await window.goodformFirebase?.ready;
    if (fb?.enabled) await fb.saveProduct(product);
    selectGoodformProduct(product.id);
    setAdminMessage(existingId ? "상품 수정이 완료됐습니다." : "상품이 저장됐습니다. 상품목록과 상세페이지에서 바로 확인할 수 있습니다.");
    renderAdminProducts();
    renderAdminSupportPanels();
  });
}

const noticeForm = document.getElementById("admin-notice-form");
if (noticeForm) {
  noticeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("admin-notice-title").value.trim();
    const body = document.getElementById("admin-notice-body").value.trim();
    if (!title || !body) return;
    const notices = readAdminJson(ADMIN_NOTICES_KEY, []);
    writeAdminJson(ADMIN_NOTICES_KEY, [{ title, body, createdAt: new Date().toISOString() }, ...notices]);
    noticeForm.reset();
    renderAdminNotices();
  });
}

const bannerForm = document.getElementById("admin-banner-form");
if (bannerForm) {
  bannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    writeAdminJson(ADMIN_BANNERS_KEY, {
      top: document.getElementById("admin-top-banner").value.trim(),
      kakao: document.getElementById("admin-kakao-banner").value.trim(),
      app: document.getElementById("admin-app-banner").value.trim()
    });
    const message = document.getElementById("admin-banner-message");
    if (message) message.textContent = "배너 문구를 저장했습니다.";
  });
}

if (resetButton) resetButton.addEventListener("click", resetForm);
if (restoreButton) restoreButton.addEventListener("click", restoreDefaults);
if (window.location.pathname === "/admin/login") sessionStorage.removeItem(ADMIN_AUTH_KEY);
setAdminLoggedIn(isAdminLoggedIn());
showAdminSection();
if (isAdminLoggedIn()) renderAdminProducts();
