const GOODFORM_STORAGE_KEYS = {
  products: "goodform.products",
  selectedProduct: "goodform.selectedProduct",
  cart: "goodform.cart",
  orders: "goodform.orders"
};

const GOODFORM_DEFAULT_PRODUCTS = [
  {
    id: "semi-over-tee",
    name: "세미오버 라운드 반팔",
    category: "상의",
    price: 29000,
    priceText: "29,000원",
    summary: "단정한 어깨선과 여유 있는 품",
    description: "AI 모델 착장 기준으로 어깨선은 정돈되고 품은 편안하게 떨어지는 데일리 반팔입니다.",
    colors: ["화이트", "블랙", "멜란지"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-one",
    fit: { shoulder: "RELAXED", chest: "SEMI-OVER", hem: "CLEAN", length: "STANDARD" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "one-tuck-slacks",
    name: "원턱 와이드 슬랙스",
    category: "팬츠",
    price: 43000,
    priceText: "43,000원",
    summary: "다리가 길어 보이는 균형감",
    description: "AI 모델 착장 기준으로 허리와 허벅지는 편안하게, 밑단으로 갈수록 자연스럽게 떨어지는 팬츠입니다.",
    colors: ["블랙", "차콜", "베이지"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-two",
    fit: { waist: "REGULAR", thigh: "RELAXED", hem: "WIDE", length: "LONG" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "cooling-collar-knit",
    name: "쿨링 카라 니트",
    category: "상의",
    price: 39000,
    priceText: "39,000원",
    summary: "여름에도 깔끔하게 떨어지는 핏",
    description: "가볍고 시원한 터치감으로 청초한 분위기를 만드는 카라 니트입니다.",
    colors: ["크림", "모카", "네이비"],
    sizes: ["M", "L"],
    imageClass: "tile-image-three",
    fit: { shoulder: "REGULAR", chest: "CLEAN", hem: "SOFT", length: "STANDARD" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "balance-denim",
    name: "밸런스 데님 팬츠",
    category: "팬츠",
    price: 47000,
    priceText: "47,000원",
    summary: "어디에나 잘 맞는 세미와이드 라인",
    description: "상의를 넣어 입어도 빼서 입어도 균형이 좋아 보이는 데님 팬츠입니다.",
    colors: ["중청", "흑청"],
    sizes: ["S", "M", "L", "XL"],
    imageClass: "tile-image-four",
    fit: { waist: "REGULAR", thigh: "RELAXED", hem: "SEMI-WIDE", length: "STANDARD" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  }
];

function formatGoodformPrice(value) {
  const number = Number(String(value).replace(/[^0-9]/g, "")) || 0;
  return `${number.toLocaleString("ko-KR")}원`;
}

function createGoodformId(name) {
  const base = String(name || "product").trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "product"}-${Date.now().toString(36)}`;
}

function getGoodformProducts() {
  const saved = localStorage.getItem(GOODFORM_STORAGE_KEYS.products);
  if (!saved) return GOODFORM_DEFAULT_PRODUCTS;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : GOODFORM_DEFAULT_PRODUCTS;
  } catch {
    return GOODFORM_DEFAULT_PRODUCTS;
  }
}

function saveGoodformProducts(products) {
  localStorage.setItem(GOODFORM_STORAGE_KEYS.products, JSON.stringify(products));
}

function getGoodformProduct(id) {
  return getGoodformProducts().find((product) => product.id === id) || getGoodformProducts()[0];
}

function selectGoodformProduct(id) {
  localStorage.setItem(GOODFORM_STORAGE_KEYS.selectedProduct, id);
}

function getSelectedGoodformProduct() {
  return getGoodformProduct(localStorage.getItem(GOODFORM_STORAGE_KEYS.selectedProduct));
}

function getGoodformCart() {
  try {
    return JSON.parse(localStorage.getItem(GOODFORM_STORAGE_KEYS.cart)) || [];
  } catch {
    return [];
  }
}

function saveGoodformCart(cart) {
  localStorage.setItem(GOODFORM_STORAGE_KEYS.cart, JSON.stringify(cart));
}

function clearGoodformCart() {
  localStorage.removeItem(GOODFORM_STORAGE_KEYS.cart);
}

function addGoodformCartItem(product, options = {}) {
  const cart = getGoodformCart();
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    priceText: product.priceText || formatGoodformPrice(product.price),
    imageClass: product.imageClass,
    imageData: product.imageData,
    color: options.color || product.colors?.[0] || "기본",
    size: options.size || product.sizes?.[0] || "FREE",
    quantity: 1
  });
  saveGoodformCart(cart);
}

function getGoodformOrders() {
  try {
    return JSON.parse(localStorage.getItem(GOODFORM_STORAGE_KEYS.orders)) || [];
  } catch {
    return [];
  }
}

function saveGoodformOrder(order) {
  const orders = getGoodformOrders();
  orders.unshift(order);
  localStorage.setItem(GOODFORM_STORAGE_KEYS.orders, JSON.stringify(orders));
}

function goodformImageStyle(item) {
  return item?.imageData ? `style="background-image: linear-gradient(180deg, rgba(20,20,20,0.02), rgba(20,20,20,0.34)), url('${item.imageData}')"` : "";
}


