const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_FIREBASE_PROJECT_ID",
  storageBucket: "REPLACE_WITH_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID"
};

const socialProviderConfig = {
  kakaoProviderId: "oidc.kakao",
  naverProviderId: "oidc.naver"
};

window.__FIREBASE_CONFIG__ = firebaseConfig;
window.__SOCIAL_PROVIDER_CONFIG__ = socialProviderConfig;






