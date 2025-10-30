// components/cart/CartPromotions.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/providers/cart";
import { storeFetch } from "@/lib/storeFetch";

export default function CartPromotions() {
  const { cart, setCart } = useCart();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart) return null;

  async function apply() {
    const promo = code.trim();
    if (!promo) return;
    setBusy(true);
    setError(null);
    try {
      console.log(promo);
      const res = await storeFetch(`/store/carts/${cart?.id}/promotions`, {
        method: "POST",
        body: JSON.stringify({ promo_codes: [promo] }),
      });
      if (!res.ok) {
        const msg = (await res.text()) || "Failed to apply code";
        throw new Error(msg);
      }
      const obj = await res.json();
      console.log(obj);
      const { cart: next } = obj;
      console.log(cart);
      setCart(next);
      setCode("");
    } catch (e: any) {
      setError(e?.message || "Failed to apply code");
    } finally {
      setBusy(false);
    }
  }

  async function removePromotion(codeToRemove: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await storeFetch(`/store/carts/${cart?.id}/promotions`, {
        method: "DELETE",
        body: JSON.stringify({ promo_codes: [codeToRemove] }),
      });
      if (!res.ok) {
        const msg = (await res.text()) || "Failed to remove code";
        throw new Error(msg);
      }
      const { cart: next } = await res.json();
      setCart(next);
    } catch (e: any) {
      setError(e?.message || "Failed to remove code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-bg-dark px-3 py-2 text-text
                     outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          disabled={busy}
        />
        <button
          onClick={apply}
          disabled={busy || !code.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-60 cursor-pointer"
        >
          {busy ? "Applying…" : "Apply"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3">
        {cart.promotions?.length ? (
          <ul className="space-y-2">
            Promotions Applied:
            {cart.promotions.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <span className="text-sm font-medium text-text">{p.code}</span>
                <button
                  onClick={() => removePromotion(p.code!)}
                  disabled={busy}
                  className="text-sm text-textMutable hover:text-text cursor-pointer"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-mutable">No promotions applied.</p>
        )}
      </div>
    </div>
  );
}
