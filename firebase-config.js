const firebaseConfig = {
  apiKey: "AIzaSyA6nJ_GRR-nKK0-2-6SE2BOmIuLFl8VoS0",
  authDomain: "goodform1-fd788.firebaseapp.com",
  projectId: "goodform1-fd788",
  storageBucket: "goodform1-fd788.firebasestorage.app",
  messagingSenderId: "847075200575",
  appId: "1:847075200575:web:2c37717ca9ed9799f7328a"
};

const socialProviderConfig = {
  kakaoProviderId: "oidc.kakao",
  naverProviderId: "oidc.naver"
};

window.__FIREBASE_CONFIG__ = firebaseConfig;
window.__SOCIAL_PROVIDER_CONFIG__ = socialProviderConfig;
