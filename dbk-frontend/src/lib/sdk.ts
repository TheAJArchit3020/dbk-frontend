// /lib/sdk.ts
import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  // IMPORTANT for storefronts: set a publishable key from Admin → Settings → API Keys
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV !== "production",
  auth: {
    // We want to reuse a JWT token (stored in localStorage by default)
    type: "jwt",
    // optional: show explicit storage choice; "local" is default anyway
    jwtTokenStorageMethod: "local", // "local" | "session" | "memory" | "nostore" | "custom"
    // jwtTokenStorageKey: "medusa_auth_token", // default key; override if you prefer
  },
});
