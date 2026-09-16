import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    env: {
      SITE_URL: "http://localhost:3000",
      RESEND_WEBHOOK_SECRET: "whsec_test123",
    },
  },
});