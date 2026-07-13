const firebaseConfig = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_FIREBASE_PROJECT_ID",
  storageBucket: "REPLACE_WITH_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_FIREBASE_APP_ID"
};

const socialProviderConfig = {
  // Firebase Authentication > Sign-in method > OpenID Connect에서 만든 제공자 ID입니다.
  // Kakao Developers의 Redirect URI에는 아래 주소를 추가해야 합니다.
  // https://REPLACE_WITH_FIREBASE_AUTH_DOMAIN/__/auth/handler
  kakaoProviderId: "oidc.kakao",
  naverProviderId: "oidc.naver"
};

window.__FIREBASE_CONFIG__ = firebaseConfig;
window.__SOCIAL_PROVIDER_CONFIG__ = socialProviderConfig;







