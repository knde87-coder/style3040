const GOODFORM_FIREBASE_PLACEHOLDER = "REPLACE_WITH_";

function hasGoodformFirebaseConfig() {
  const config = window.__FIREBASE_CONFIG__;
  return Boolean(config && Object.values(config).every((value) => typeof value === "string" && value && !value.startsWith(GOODFORM_FIREBASE_PLACEHOLDER)));
}

window.goodformFirebase = {
  enabled: hasGoodformFirebaseConfig(),
  ready: null,
  app: null,
  db: null,
  storage: null,
  auth: null,
  async getProducts() { return null; },
  async saveProduct() { return false; },
  async deleteProduct() { return false; },
  async getOrders() { return null; },
  async saveOrder() { return false; },
  async createUser() { return null; },
  async loginUser() { return null; },
  async loginWithKakao() { return null; },
  async logout() { return false; }
};

function goodformEmailFromId(id) {
  const value = String(id || "").trim();
  return value.includes("@") ? value : `${value}@goodform.local`;
}

window.goodformFirebase.ready = (async () => {
  if (!hasGoodformFirebaseConfig()) {
    return window.goodformFirebase;
  }

  const [appModule, firestoreModule, storageModule, authModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
  ]);

  const app = appModule.initializeApp(window.__FIREBASE_CONFIG__);
  const db = firestoreModule.getFirestore(app);
  const storage = storageModule.getStorage(app);
  const auth = authModule.getAuth(app);

  async function getProducts() {
    const snapshot = await firestoreModule.getDocs(firestoreModule.collection(db, "products"));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  }

  async function saveProduct(product) {
    await firestoreModule.setDoc(firestoreModule.doc(db, "products", product.id), {
      ...product,
      updatedAt: firestoreModule.serverTimestamp()
    }, { merge: true });
    return true;
  }

  async function deleteProduct(id) {
    await firestoreModule.deleteDoc(firestoreModule.doc(db, "products", id));
    return true;
  }

  async function getOrders() {
    const snapshot = await firestoreModule.getDocs(firestoreModule.collection(db, "orders"));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  }

  async function saveOrder(order) {
    await firestoreModule.setDoc(firestoreModule.doc(db, "orders", order.id), {
      ...order,
      updatedAt: firestoreModule.serverTimestamp()
    }, { merge: true });
    return true;
  }

  async function saveUserProfile(user, extra = {}) {
    await firestoreModule.setDoc(firestoreModule.doc(db, "users", user.uid), {
      uid: user.uid,
      id: extra.id || user.email || user.uid,
      name: extra.name || user.displayName || extra.id || "회원",
      email: user.email || "",
      provider: extra.provider || "idpw",
      role: "customer",
      joinedAt: firestoreModule.serverTimestamp()
    }, { merge: true });
  }

  async function createUser({ id, password, name }) {
    const credential = await authModule.createUserWithEmailAndPassword(auth, goodformEmailFromId(id), password);
    await saveUserProfile(credential.user, { id, name, provider: "idpw" });
    return { id, name: name || id, provider: "idpw", role: "customer" };
  }

  async function loginUser(id, password) {
    const credential = await authModule.signInWithEmailAndPassword(auth, goodformEmailFromId(id), password);
    return { id, name: credential.user.displayName || id, provider: "idpw", role: "customer" };
  }

  async function loginWithKakao() {
    const providerId = window.__SOCIAL_PROVIDER_CONFIG__?.kakaoProviderId || "oidc.kakao";
    const provider = new authModule.OAuthProvider(providerId);
    const credential = await authModule.signInWithPopup(auth, provider);
    await saveUserProfile(credential.user, { provider: "kakao" });
    return { id: credential.user.email || credential.user.uid, name: credential.user.displayName || "카카오 회원", provider: "kakao", role: "customer" };
  }

  async function logout() {
    await authModule.signOut(auth);
    return true;
  }

  Object.assign(window.goodformFirebase, {
    enabled: true,
    app,
    db,
    storage,
    auth,
    getProducts,
    saveProduct,
    deleteProduct,
    getOrders,
    saveOrder,
    createUser,
    loginUser,
    loginWithKakao,
    logout
  });

  return window.goodformFirebase;
})();
