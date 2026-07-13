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
  async getProducts() { return null; },
  async saveProduct() { return false; },
  async deleteProduct() { return false; },
  async getOrders() { return null; },
  async saveOrder() { return false; }
};

window.goodformFirebase.ready = (async () => {
  if (!hasGoodformFirebaseConfig()) {
    return window.goodformFirebase;
  }

  const [appModule, firestoreModule, storageModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js")
  ]);

  const app = appModule.initializeApp(window.__FIREBASE_CONFIG__);
  const db = firestoreModule.getFirestore(app);
  const storage = storageModule.getStorage(app);

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

  Object.assign(window.goodformFirebase, {
    enabled: true,
    app,
    db,
    storage,
    getProducts,
    saveProduct,
    deleteProduct,
    getOrders,
    saveOrder
  });

  return window.goodformFirebase;
})();
