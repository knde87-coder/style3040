const GOODFORM_STORAGE_KEYS = {
  products: "goodform.products",
  selectedProduct: "goodform.selectedProduct",
  cart: "goodform.cart",
  orders: "goodform.orders"
};

const GOODFORM_DEFAULT_PRODUCTS = [
  {
    id: "ice-stripe-shirt",
    name: "V274_아이스 스트라이프 반팔셔츠",
    category: "상의",
    price: 39000,
    priceText: "39,000원",
    comparePriceText: "80,000원",
    summary: "시원하게 떨어지는 여름 셔츠",
    description: "얇고 산뜻한 터치감에 세로 스트라이프가 더해져 상체가 길고 깔끔해 보이는 반팔 셔츠입니다.",
    colors: ["스카이", "베이지", "네이비"],
    sizes: ["M", "L", "XL", "2XL"],
    imageClass: "tile-image-shirt-stripe",
    fit: { 어깨: "REGULAR", 가슴: "RELAXED", 총장: "STANDARD", 무드: "CLEAN" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "military-pocket-shirt",
    name: "Y326_밀리터리 포켓 반팔셔츠",
    category: "상의",
    price: 39000,
    priceText: "39,000원",
    comparePriceText: "80,000원",
    summary: "담백한 포켓 포인트 셔츠",
    description: "가슴 포켓과 정돈된 카라 라인이 캐주얼하지만 가볍지 않은 분위기를 만드는 남성 반팔 셔츠입니다.",
    colors: ["카키", "베이지", "차콜"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-pocket-shirt",
    fit: { 어깨: "REGULAR", 가슴: "CLEAN", 총장: "STANDARD", 무드: "SMART" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "linen-china-set",
    name: "C613_린넨 차이나 상하세트",
    category: "상하세트",
    price: 39000,
    priceText: "39,000원",
    comparePriceText: "80,000원",
    summary: "휴양지와 데일리에 모두 맞는 셋업",
    description: "차이나 카라 상의와 편한 팬츠가 세트로 구성되어 한 벌만 입어도 완성도 있는 여름 룩입니다.",
    colors: ["화이트", "네이비"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-linen-set",
    fit: { 상의: "RELAXED", 하의: "COMFORT", 총장: "STANDARD", 무드: "RESORT" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "cool-collar-knit",
    name: "4 COLOR 쿨링 카라 반팔 니트",
    category: "상의",
    price: 43000,
    priceText: "43,000원",
    comparePriceText: "68,000원",
    summary: "오픈 카라의 세련된 무드",
    description: "부드러운 착용감과 자연스러운 넥 라인으로 데일리룩과 출근룩에 모두 어울리는 카라 니트입니다.",
    colors: ["크림", "모카", "그레이", "블랙"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-three",
    fit: { 어깨: "REGULAR", 가슴: "SOFT", 밑단: "CLEAN", 무드: "MINIMAL" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "one-tuck-slacks",
    name: "차르르 원턱 와이드 슬랙스",
    category: "하의",
    price: 43000,
    priceText: "43,000원",
    comparePriceText: "69,000원",
    summary: "다리가 길어 보이는 균형감",
    description: "허리와 허벅지는 편안하고 밑단은 자연스럽게 떨어지는 남성 와이드 슬랙스입니다.",
    colors: ["블랙", "차콜", "베이지"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-two",
    fit: { 허리: "REGULAR", 허벅지: "RELAXED", 밑단: "WIDE", 기장: "LONG" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "basic-black-shirt",
    name: "기본에 힘을 준 미니멀 블랙셔츠",
    category: "상의",
    price: 36000,
    priceText: "36,000원",
    comparePriceText: "58,000원",
    summary: "정돈된 핏의 데일리 셔츠",
    description: "과하지 않은 여유와 단정한 카라 라인으로 하나만 입어도 깔끔한 기본 셔츠입니다.",
    colors: ["블랙", "화이트", "차콜"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-black",
    fit: { 어깨: "CLEAN", 가슴: "REGULAR", 총장: "STANDARD", 무드: "DAILY" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "semi-over-tee",
    name: "세미오버 라운드 반팔",
    category: "상의",
    price: 29000,
    priceText: "29,000원",
    comparePriceText: "45,000원",
    summary: "단정한 어깨선과 여유 있는 품",
    description: "어깨선은 정돈되고 품은 여유 있게 떨어지는 남성 데일리 반팔입니다.",
    colors: ["화이트", "블랙", "멜란지"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-one",
    fit: { 어깨: "RELAXED", 가슴: "SEMI-OVER", 밑단: "CLEAN", 총장: "STANDARD" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "balance-denim",
    name: "밸런스 세미와이드 데님팬츠",
    category: "하의",
    price: 47000,
    priceText: "47,000원",
    comparePriceText: "72,000원",
    summary: "어디에나 잘 맞는 세미와이드 라인",
    description: "상의를 넣어 입어도 빼서 입어도 비율이 좋아 보이는 세미와이드 데님입니다.",
    colors: ["중청", "흑청"],
    sizes: ["S", "M", "L", "XL"],
    imageClass: "tile-image-four",
    fit: { 허리: "REGULAR", 허벅지: "RELAXED", 밑단: "SEMI-WIDE", 기장: "STANDARD" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "light-windbreaker",
    name: "라이트 바람막이 점퍼",
    category: "외투",
    price: 59000,
    priceText: "59,000원",
    comparePriceText: "89,000원",
    summary: "가볍게 걸치는 여름 아우터",
    description: "얇고 가벼운 소재로 실내외 온도 차가 큰 날에도 부담 없이 걸치기 좋은 점퍼입니다.",
    colors: ["아이보리", "카키", "블랙"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-outer",
    fit: { 어깨: "RELAXED", 가슴: "LOOSE", 총장: "SHORT", 무드: "CASUAL" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "summer-short-set",
    name: "썸머 오픈카라 반바지 세트",
    category: "상하세트",
    price: 62000,
    priceText: "62,000원",
    comparePriceText: "98,000원",
    summary: "한 번에 완성되는 휴양지룩",
    description: "상하의 균형이 맞는 여름 셋업으로 여행, 데이트, 주말 코디에 활용하기 좋습니다.",
    colors: ["베이지", "네이비"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-resort",
    fit: { 상의: "RELAXED", 하의: "EASY", 총장: "STANDARD", 무드: "RESORT" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "minimal-sandal",
    name: "미니멀 레더 샌들",
    category: "신발",
    price: 49000,
    priceText: "49,000원",
    comparePriceText: "75,000원",
    summary: "여름 코디를 가볍게 마무리",
    description: "슬랙스, 데님, 셋업과 모두 잘 어울리는 담백한 디자인의 남성 샌들입니다.",
    colors: ["블랙", "브라운"],
    sizes: ["250", "260", "270", "280"],
    imageClass: "tile-image-shoes",
    fit: { 굽: "LOW", 착화감: "SOFT", 무드: "MINIMAL", 계절: "SUMMER" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "daily-cross-bag",
    name: "데일리 미니 크로스백",
    category: "ACC",
    price: 32000,
    priceText: "32,000원",
    comparePriceText: "52,000원",
    summary: "가볍게 드는 남성 액세서리",
    description: "폰, 지갑, 이어폰을 담기 좋은 사이즈로 데일리룩에 자연스럽게 어울립니다.",
    colors: ["블랙", "카키"],
    sizes: ["FREE"],
    imageClass: "tile-image-bag",
    fit: { 크기: "COMPACT", 수납: "DAILY", 무드: "CLEAN", 계절: "ALL" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "cotton-over-jacket",
    name: "코튼 오버핏 셔츠 자켓",
    category: "외투",
    price: 54000,
    priceText: "54,000원",
    comparePriceText: "82,000원",
    summary: "셔츠처럼 가볍게 걸치는 외투",
    description: "티셔츠 위에 가볍게 걸치기 좋은 코튼 셔츠 자켓입니다.",
    colors: ["카키", "크림", "블랙"],
    sizes: ["M", "L", "XL"],
    imageClass: "tile-image-outer",
    fit: { 어깨: "OVER", 가슴: "RELAXED", 총장: "STANDARD", 무드: "CASUAL" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "clean-runner",
    name: "클린 데일리 러너 스니커즈",
    category: "신발",
    price: 59000,
    priceText: "59,000원",
    comparePriceText: "89,000원",
    summary: "슬랙스와 데님에 모두 맞는 스니커즈",
    description: "과한 장식 없이 데일리룩에 자연스럽게 맞는 남성 스니커즈입니다.",
    colors: ["화이트", "블랙"],
    sizes: ["250", "260", "270", "280"],
    imageClass: "tile-image-shoes",
    fit: { 굽: "LOW", 착화감: "SOFT", 무드: "CLEAN", 계절: "ALL" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  },
  {
    id: "silver-chain-necklace",
    name: "실버 포인트 체인 목걸이",
    category: "ACC",
    price: 24000,
    priceText: "24,000원",
    comparePriceText: "39,000원",
    summary: "티셔츠에 포인트를 주는 액세서리",
    description: "기본 티셔츠와 셔츠 사이에 가볍게 포인트를 줄 수 있는 체인 목걸이입니다.",
    colors: ["실버"],
    sizes: ["FREE"],
    imageClass: "tile-image-bag",
    fit: { 크기: "LIGHT", 무드: "POINT", 계절: "ALL", 관리: "EASY" },
    aiStatus: "AI MODEL",
    stockStatus: "판매중"
  }
];

const GOODFORM_CATEGORY_SHOWCASE_PRODUCTS = [
  { id: "top-linen-henley-7584", name: "7584_마코르 헨리넥 셔츠", category: "상의", price: 39000, priceText: "39,000원", comparePriceText: "89,000원", summary: "차분한 린넨 헨리넥", description: "가볍고 담백한 린넨 텍스처로 여름 데일리룩에 잘 맞는 헨리넥 셔츠입니다.", colors: ["베이지", "화이트"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-01", fit: { 어깨: "REGULAR", 가슴: "RELAXED", 총장: "STANDARD", 무드: "CLEAN" }, aiStatus: "BEST", stockStatus: "판매중" },
  { id: "top-soft-henley-6953", name: "6953_스무디 반팔티", category: "상의", price: 29000, priceText: "29,000원", comparePriceText: "55,000원", summary: "쫀쫀한 블랙 반팔", description: "몸선을 과하게 드러내지 않고 깔끔하게 잡아주는 데일리 반팔티입니다.", colors: ["블랙", "화이트"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-02", fit: { 어깨: "REGULAR", 가슴: "CLEAN", 총장: "STANDARD", 무드: "MINIMAL" }, aiStatus: "SALE", stockStatus: "판매중" },
  { id: "top-white-shirt-7129", name: "7129_린넨 셔츠", category: "상의", price: 29000, priceText: "29,000원", comparePriceText: "59,000원", summary: "깔끔한 화이트 셔츠", description: "가벼운 소재와 여유 있는 실루엣으로 여름에도 산뜻하게 입기 좋은 셔츠입니다.", colors: ["화이트", "스카이"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-03", fit: { 어깨: "RELAXED", 가슴: "SOFT", 총장: "STANDARD", 무드: "FRESH" }, aiStatus: "BEST", stockStatus: "판매중" },
  { id: "top-surfing-tee-7518", name: "7518_서핑 반팔티셔츠", category: "상의", price: 34000, priceText: "34,000원", comparePriceText: "70,000원", summary: "후면 그래픽 포인트", description: "후면 그래픽으로 단품 포인트가 확실한 여름 반팔 티셔츠입니다.", colors: ["화이트", "멜란지"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-04", fit: { 어깨: "REGULAR", 가슴: "RELAXED", 총장: "STANDARD", 무드: "CASUAL" }, aiStatus: "HIT", stockStatus: "판매중" },
  { id: "top-collar-tee-7158", name: "7158_유틸리티 반팔 셔츠", category: "상의", price: 29000, priceText: "29,000원", comparePriceText: "69,000원", summary: "깨끗한 카라 반팔", description: "넥 라인이 답답하지 않고 깨끗하게 정리되는 반팔 셔츠입니다.", colors: ["화이트", "블랙"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-05", fit: { 어깨: "REGULAR", 가슴: "CLEAN", 총장: "STANDARD", 무드: "DAILY" }, aiStatus: "SALE", stockStatus: "판매중" },
  { id: "top-graphic-knit-7023", name: "7023_마니또 니트", category: "상의", price: 29000, priceText: "29,000원", comparePriceText: "62,000원", summary: "컬러 그래픽 니트", description: "심플한 팬츠와 매치했을 때 포인트가 살아나는 그래픽 니트 티셔츠입니다.", colors: ["크림", "그레이"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-06", fit: { 어깨: "RELAXED", 가슴: "SOFT", 총장: "STANDARD", 무드: "POINT" }, aiStatus: "MD", stockStatus: "판매중" },
  { id: "top-stripe-shirt-7261", name: "7261_주름 스트라이프 셔츠", category: "상의", price: 29000, priceText: "29,000원", comparePriceText: "69,000원", summary: "세로선이 살아나는 셔츠", description: "세로 스트라이프와 가벼운 주름감으로 상체가 길어 보이는 셔츠입니다.", colors: ["블랙", "베이지"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-07", fit: { 어깨: "RELAXED", 가슴: "RELAXED", 총장: "STANDARD", 무드: "SMART" }, aiStatus: "HIT", stockStatus: "판매중" },
  { id: "top-mockneck-7208", name: "7208_자가드 반목 셔츠", category: "상의", price: 29000, priceText: "29,000원", comparePriceText: "59,000원", summary: "단정한 반목 티셔츠", description: "목선을 정리해 주고 깔끔한 인상을 만드는 반목 스타일 티셔츠입니다.", colors: ["화이트", "블랙"], sizes: ["M", "L", "XL"], imageClass: "top-showcase-08", fit: { 어깨: "REGULAR", 가슴: "CLEAN", 총장: "STANDARD", 무드: "MINIMAL" }, aiStatus: "BEST", stockStatus: "판매중" },
  { id: "bottom-cotton-wide-6552", name: "6552_트렌드 린넨팬츠 1+1", category: "하의", price: 32000, priceText: "32,000원", comparePriceText: "49,000원", summary: "편한 와이드 린넨 팬츠", description: "여유 있는 통과 자연스러운 주름감으로 데일리하게 입기 좋은 와이드 팬츠입니다.", colors: ["블랙", "베이지"], sizes: ["M", "L", "XL", "2XL"], imageClass: "bottom-showcase-01", fit: { 허리: "BANDING", 허벅지: "RELAXED", 밑단: "WIDE", 기장: "LONG" }, aiStatus: "1+1", stockStatus: "판매중" },
  { id: "bottom-cool-check-7516", name: "7516_하객 체크 팬츠", category: "하의", price: 29000, priceText: "29,000원", comparePriceText: "42,000원", summary: "시원한 체크 밴딩 팬츠", description: "밴딩 허리와 체크 패턴으로 편하면서도 밋밋하지 않은 팬츠입니다.", colors: ["네이비", "그레이"], sizes: ["M", "L", "XL"], imageClass: "bottom-showcase-02", fit: { 허리: "BANDING", 허벅지: "RELAXED", 밑단: "TAPERED", 기장: "ANKLE" }, aiStatus: "HIT", stockStatus: "판매중" },
  { id: "bottom-linen-oneplus-7465", name: "7465_와이드 린넨팬츠 1+1", category: "하의", price: 35000, priceText: "35,000원", comparePriceText: "79,000원", summary: "여름 린넨 와이드", description: "가볍고 통기성이 좋아 더운 날에도 편안하게 입는 린넨 와이드 팬츠입니다.", colors: ["아이보리", "차콜"], sizes: ["M", "L", "XL"], imageClass: "bottom-showcase-03", fit: { 허리: "EASY", 허벅지: "LOOSE", 밑단: "WIDE", 기장: "LONG" }, aiStatus: "BEST", stockStatus: "판매중" },
  { id: "bottom-cargo-shorts-2971", name: "2971_시티 밴딩 반바지 1+1", category: "하의", price: 29000, priceText: "29,000원", comparePriceText: "49,000원", summary: "포켓 포인트 반바지", description: "활동성이 좋고 포켓 디테일이 살아있는 여름 카고 반바지입니다.", colors: ["카키", "블랙"], sizes: ["M", "L", "XL"], imageClass: "bottom-showcase-04", fit: { 허리: "BANDING", 허벅지: "RELAXED", 밑단: "SHORT", 기장: "HALF" }, aiStatus: "1+1", stockStatus: "판매중" },
  { id: "bottom-black-crop-4794", name: "4794_기본 크롭 팬츠", category: "하의", price: 29000, priceText: "29,000원", comparePriceText: "59,000원", summary: "깔끔한 블랙 팬츠", description: "셔츠와 티셔츠에 모두 잘 맞는 기본 블랙 크롭 팬츠입니다.", colors: ["블랙"], sizes: ["M", "L", "XL"], imageClass: "bottom-showcase-05", fit: { 허리: "REGULAR", 허벅지: "CLEAN", 밑단: "SLIM", 기장: "CROP" }, aiStatus: "BEST", stockStatus: "판매중" },
  { id: "bottom-light-denim-6457", name: "6457_런더 무 청바지", category: "하의", price: 49000, priceText: "49,000원", comparePriceText: "89,000원", summary: "연청 데님 팬츠", description: "밝은 컬러감으로 여름 상의와 산뜻하게 매치되는 데님 팬츠입니다.", colors: ["연청"], sizes: ["S", "M", "L", "XL"], imageClass: "bottom-showcase-06", fit: { 허리: "REGULAR", 허벅지: "RELAXED", 밑단: "STRAIGHT", 기장: "STANDARD" }, aiStatus: "MD", stockStatus: "판매중" },
  { id: "bottom-premium-slacks-5138", name: "5138_프리미엄 정장바지", category: "하의", price: 39000, priceText: "39,000원", comparePriceText: "89,000원", summary: "정돈된 슬랙스 핏", description: "허리부터 밑단까지 깔끔하게 떨어져 출근룩과 하객룩에 좋은 슬랙스입니다.", colors: ["네이비", "차콜"], sizes: ["M", "L", "XL"], imageClass: "bottom-showcase-07", fit: { 허리: "REGULAR", 허벅지: "CLEAN", 밑단: "STRAIGHT", 기장: "LONG" }, aiStatus: "HURRY UP", stockStatus: "판매중" },
  { id: "bottom-secret-slacks-3495", name: "3495_본더핏 팬츠", category: "하의", price: 48000, priceText: "48,000원", comparePriceText: "100,000원", summary: "다리가 길어 보이는 블랙 팬츠", description: "군더더기 없는 블랙 실루엣으로 다리 라인을 길고 깔끔하게 보여주는 팬츠입니다.", colors: ["블랙"], sizes: ["M", "L", "XL"], imageClass: "bottom-showcase-08", fit: { 허리: "REGULAR", 허벅지: "SLIM", 밑단: "STRAIGHT", 기장: "LONG" }, aiStatus: "HIT", stockStatus: "판매중" }
];
function formatGoodformPrice(value) {
  const number = Number(String(value).replace(/[^0-9]/g, "")) || 0;
  return `${number.toLocaleString("ko-KR")}원`;
}

function createGoodformId(name) {
  const base = String(name || "product").trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "product"}-${Date.now().toString(36)}`;
}

function normalizeGoodformProduct(product = {}) {
  const price = Number(String(product.price || product.priceText || "0").replace(/[^0-9]/g, "")) || 0;
  return {
    id: product.id || createGoodformId(product.name || "상품"),
    name: product.name || "비율좋은그남자 상품",
    category: product.category || "상의",
    price,
    priceText: product.priceText || formatGoodformPrice(price),
    comparePriceText: product.comparePriceText || "",
    summary: product.summary || "핏과 비율을 살리는 남성 데일리웨어",
    description: product.description || product.summary || "깔끔한 남성 데일리웨어입니다.",
    colors: Array.isArray(product.colors) && product.colors.length ? product.colors : ["기본"],
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ["FREE"],
    imageClass: product.imageClass || "tile-image-one",
    imageData: product.imageData || "",
    fit: product.fit || { 핏: "REGULAR", 기장: "STANDARD", 무드: "CLEAN", 착용감: "SOFT" },
    aiStatus: product.aiStatus || "READY",
    stockStatus: product.stockStatus || "판매중",
    deliveryNotice: product.deliveryNotice || "중국 제작 오더 상품으로 영업일 기준 9~14일 정도 소요될 수 있습니다.",
    badge: product.badge || product.aiStatus || "BEST",
    updatedAt: product.updatedAt || new Date().toISOString()
  };
}

function mergeGoodformProducts(...groups) {
  const seen = new Set();
  return groups.flat().map(normalizeGoodformProduct).filter((product) => {
    if (!product?.id || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function getGoodformProducts() {
  const baseProducts = mergeGoodformProducts(GOODFORM_CATEGORY_SHOWCASE_PRODUCTS, GOODFORM_DEFAULT_PRODUCTS);
  const saved = localStorage.getItem(GOODFORM_STORAGE_KEYS.products);
  if (!saved) return baseProducts;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? mergeGoodformProducts(parsed, GOODFORM_CATEGORY_SHOWCASE_PRODUCTS, GOODFORM_DEFAULT_PRODUCTS) : baseProducts;
  } catch {
    return baseProducts;
  }
}

function saveGoodformProducts(products) {
  const normalized = Array.isArray(products) ? products.map(normalizeGoodformProduct) : [];
  localStorage.setItem(GOODFORM_STORAGE_KEYS.products, JSON.stringify(normalized));
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
    quantity: 1,
    category: product.category,
    deliveryNotice: product.deliveryNotice || "영업일 기준 9~14일 소요"
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
  return item?.imageData ? `style="background-image: linear-gradient(180deg, rgba(20,20,20,0.02), rgba(20,20,20,0.2)), url('${item.imageData}')"` : "";
}







