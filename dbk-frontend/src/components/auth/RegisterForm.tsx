// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { sdk } from "@/lib/sdk";
import { FetchError } from "@medusajs/js-sdk";
import { useCustomer } from "@/providers/customer";
import { useCart } from "@/providers/cart";

type Props = {
  onSuccess?: () => void;
  className?: string;
};

export default function RegisterForm({ onSuccess, className = "" }: Props) {
  const { refresh } = useCustomer();
  const { cart, setCart } = useCart();

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [confirmPwd, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const finish = async () => {
    await refresh(); // hydrate customer context
    if (cart?.id) {
      try {
        const { cart: updated } = await sdk.store.cart.transferCart(cart.id);
        setCart(updated);
      } catch {}
    }
    onSuccess?.();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!firstName || !lastName || !email || !password) {
      setErr("Please fill all fields.");
      return;
    }
    if (password !== confirmPwd) {
      setErr("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await sdk.auth.register("customer", "emailpass", { email, password });
      await sdk.store.customer.create({
        first_name: firstName,
        last_name: lastName,
        email,
      });
      await finish();
    } catch (error) {
      const fe = error as FetchError;
      if (
        fe?.statusText === "Unauthorized" &&
        fe?.message === "Identity with email already exists"
      ) {
        try {
          const token = await sdk.auth.login("customer", "emailpass", {
            email,
            password,
          });
          if (typeof token !== "string")
            throw new Error("Unsupported auth flow");
          await sdk.store.customer.create({
            first_name: firstName,
            last_name: lastName,
            email,
          });
          await finish();
        } catch (e2) {
          const fe2 = e2 as FetchError;
          setErr(fe2?.message || "Could not complete registration");
        } finally {
          setBusy(false);
        }
        return;
      }
      setErr(fe?.message || "Could not create account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold">Create Account</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="rounded-md border px-3 py-2"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirst(e.target.value)}
          required
        />
        <input
          className="rounded-md border px-3 py-2"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLast(e.target.value)}
          required
        />
      </div>
      <input
        className="w-full rounded-md border px-3 py-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full rounded-md border px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPwd(e.target.value)}
        required
      />
      <input
        className="w-full rounded-md border px-3 py-2"
        type="password"
        placeholder="Re-enter password"
        value={confirmPwd}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {busy ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
