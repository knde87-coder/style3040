window.__GOODFORM_INTEGRATIONS__ = {
  siteUrl: "https://goodform-five.vercel.app",
  youtubeUrl: "https://www.youtube.com/@goodform",
  payment: {
    provider: "toss",
    clientKey: "REPLACE_WITH_TOSS_CLIENT_KEY"
  },
  aiImage: {
    endpoint: "REPLACE_WITH_SERVER_AI_IMAGE_ENDPOINT",
    status: "ready_for_backend_connection"
  },
  database: {
    provider: "firebase",
    collections: ["products", "orders", "users"]
  },
  storage: {
    provider: "firebase-storage",
    buckets: ["product-originals", "ai-model-cuts"]
  }
};



