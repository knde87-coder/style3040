import { readFile, writeFile } from "node:fs/promises";

const target = "firebase-config.js";
const values = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
const provider = {
  kakaoProviderId: process.env.KAKAO_PROVIDER_ID || "oidc.kakao",
  naverProviderId: process.env.NAVER_PROVIDER_ID || "oidc.naver"
};
const hasRealFirebaseEnv = Object.values(values).every(Boolean);

if (!hasRealFirebaseEnv) {
  const current = await readFile(target, "utf8");
  if (current.includes("REPLACE_WITH_FIREBASE_API_KEY")) {
    console.log("Firebase env not found. Keeping placeholder firebase-config.js.");
  } else {
    console.log("Firebase env not found. Existing firebase-config.js left unchanged.");
  }
  process.exit(0);
}

const content = `const firebaseConfig = ${JSON.stringify(values, null, 2)};\n\nconst socialProviderConfig = ${JSON.stringify(provider, null, 2)};\n\nwindow.__FIREBASE_CONFIG__ = firebaseConfig;\nwindow.__SOCIAL_PROVIDER_CONFIG__ = socialProviderConfig;\n`;
await writeFile(target, content, "utf8");
console.log("firebase-config.js generated from environment variables.");
