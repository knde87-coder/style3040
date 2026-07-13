import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const toggleButtons = Array.from(document.querySelectorAll(".toggle-button"));
const form = document.getElementById("auth-form");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const phoneField = document.getElementById("phone");
const marketingField = document.getElementById("marketing");
const message = document.getElementById("form-message");
const statusBox = document.getElementById("firebase-status");
const accountPanel = document.getElementById("account-panel");
const accountName = document.getElementById("account-name");
const accountEmail = document.getElementById("account-email");
const logoutButton = document.getElementById("logout-button");
const kakaoLoginButton = document.getElementById("kakao-login-button");
const naverLoginButton = document.getElementById("naver-login-button");
const socialGuide = document.getElementById("social-guide");

let mode = "signup";
let auth;
let db;

function hasFirebaseConfig(config) {
  return config && Object.values(config).every((value) => typeof value === "string" && value && !value.startsWith("REPLACE_WITH_"));
}

function setMessage(text, tone = "default") {
  message.textContent = text;
  message.style.color = tone === "error" ? "#b42318" : tone === "success" ? "#0e5a52" : "#46534d";
}

function setMode(nextMode) {
  mode = nextMode;
  toggleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === nextMode);
  });

  const signupMode = nextMode === "signup";
  nameField.closest("label").hidden = !signupMode;
  phoneField.closest("label").hidden = !signupMode;
  marketingField.closest("label").hidden = !signupMode;
  passwordField.autocomplete = signupMode ? "new-password" : "current-password";
  form.querySelector(".submit-button").textContent = signupMode ? "일반가입 회원정보 저장하기" : "일반로그인 하기";
  setMessage(signupMode ? "일반가입으로 비율좋은그사람 회원 혜택을 시작할 수 있습니다." : "기존 일반가입 이메일로 로그인할 수 있습니다.");
}

function showAccount(user) {
  accountPanel.hidden = false;
  form.hidden = true;
  accountName.textContent = `${user.displayName || "회원"}님 반갑습니다.`;
  accountEmail.textContent = user.email || "";
}

function showForm() {
  accountPanel.hidden = true;
  form.hidden = false;
}

async function saveUserProfile(user, extra = {}) {
  const profile = {
    uid: user.uid,
    name: extra.name ?? nameField.value.trim() ?? user.displayName ?? "",
    email: extra.email ?? emailField.value.trim() ?? user.email ?? "",
    phone: extra.phone ?? phoneField.value.trim() ?? "",
    provider: extra.provider ?? (user.providerData[0]?.providerId || "password"),
    marketingAccepted: extra.marketingAccepted ?? marketingField.checked,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", user.uid), profile, { merge: true });
}

function initFirebase() {
  const config = window.__FIREBASE_CONFIG__;

  if (!hasFirebaseConfig(config)) {
    statusBox.innerHTML = "회원 기능은 연결 준비 중입니다. 사이트 화면과 가입 흐름은 먼저 확인할 수 있습니다.";
    if (socialGuide) {
      socialGuide.textContent = "지금은 가입 화면까지 준비된 상태입니다. 로그인 연결 후 바로 사용할 수 있습니다.";
    }
    setMessage("지금은 화면까지 준비된 상태입니다. 로그인 연결 후 일반가입과 소셜 로그인을 사용할 수 있습니다.");
    return false;
  }

  const app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);

  statusBox.innerHTML = "회원 기능 연결이 완료되었습니다. 일반가입과 소셜 로그인을 사용할 수 있습니다.";
  if (socialGuide) {
    socialGuide.textContent = "카카오와 네이버 로그인도 같은 회원 화면에서 사용할 수 있습니다.";
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      showAccount(user);
      setMessage("로그인 상태가 유지되고 있습니다.", "success");
    } else {
      showForm();
    }
  });

  return true;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      setMessage("오프라인 준비 등록 중 문제가 있었지만 사이트 이용은 가능합니다.");
    });
  });
}

async function handleSocialLogin(providerName) {
  if (!auth || !db) {
    setMessage("아직 소셜 로그인 연결이 완료되지 않았습니다.", "error");
    return;
  }

  const providerConfig = window.__SOCIAL_PROVIDER_CONFIG__ || {};
  const providerId = providerName === "kakao" ? providerConfig.kakaoProviderId : providerConfig.naverProviderId;

  if (!providerId || providerId.startsWith("REPLACE_WITH_")) {
    setMessage(`${providerName === "kakao" ? "카카오" : "네이버"} 제공자 ID 설정이 아직 비어 있습니다.`, "error");
    return;
  }

  try {
    const provider = new OAuthProvider(providerId);
    const result = await signInWithPopup(auth, provider);
    await saveUserProfile(result.user, {
      name: result.user.displayName || "",
      email: result.user.email || "",
      provider: providerName,
      marketingAccepted: false
    });
    setMessage(`${providerName === "kakao" ? "카카오" : "네이버"} 로그인에 성공했고 회원정보가 저장되었습니다.`, "success");
  } catch (error) {
    setMessage(error.message || "소셜 로그인 처리 중 오류가 발생했습니다.", "error");
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

if (kakaoLoginButton) {
  kakaoLoginButton.addEventListener("click", () => handleSocialLogin("kakao"));
}

if (naverLoginButton) {
  naverLoginButton.addEventListener("click", () => handleSocialLogin("naver"));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!auth || !db) {
    setMessage("아직 회원 저장 연결이 완료되지 않았습니다.", "error");
    return;
  }

  try {
    if (mode === "signup") {
      const credential = await createUserWithEmailAndPassword(auth, emailField.value.trim(), passwordField.value);

      if (nameField.value.trim()) {
        await updateProfile(credential.user, { displayName: nameField.value.trim() });
      }

      await saveUserProfile(credential.user, { provider: "general" });
      setMessage("일반가입이 완료되었고 회원정보가 저장되었습니다.", "success");
    } else {
      await signInWithEmailAndPassword(auth, emailField.value.trim(), passwordField.value);
      setMessage("일반로그인 되었습니다.", "success");
    }
  } catch (error) {
    setMessage(error.message || "처리 중 오류가 발생했습니다.", "error");
  }
});

logoutButton.addEventListener("click", async () => {
  if (!auth) {
    return;
  }

  await signOut(auth);
  showForm();
  setMode("login");
  setMessage("로그아웃되었습니다.");
});

setMode("signup");
initFirebase();
registerServiceWorker();








