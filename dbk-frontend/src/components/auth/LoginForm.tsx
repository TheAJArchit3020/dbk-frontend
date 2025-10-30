// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { sdk } from "@/lib/sdk";
import { FetchError } from "@medusajs/js-sdk";
import { useCustomer } from "@/providers/customer";
import { useCart } from "@/providers/cart";

type Props = {
  onSuccess?: () => void; // optional
  className?: string;
};

export default function LoginForm({ onSuccess, className = "" }: Props) {
  const { refresh } = useCustomer();
  const { cart, setCart } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!email || !password) return;

    setBusy(true);
    try {
      const token = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });
      if (typeof token !== "string") {
        setErr("Requires extra auth steps not supported in this flow.");
        return;
      }

      // hydrate customer context
      await refresh();

      // (optional) transfer guest cart → customer cart
      if (cart?.id) {
        try {
          const { cart: updated } = await sdk.store.cart.transferCart(cart.id);
          setCart(updated);
        } catch {
          /* ignore */
        }
      }

      onSuccess?.();
    } catch (error) {
      const fe = error as FetchError;
      setErr(fe?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold">Login</h3>
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-md border px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-md border px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {busy ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
