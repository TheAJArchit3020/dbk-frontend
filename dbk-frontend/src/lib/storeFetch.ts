// lib/storeFetch.ts
export async function storeFetch(path: string, init: RequestInit = {}) {
  const base =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:9000";

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set(
    "x-publishable-api-key",
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp"
  );

  return fetch(`${base}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });
}
