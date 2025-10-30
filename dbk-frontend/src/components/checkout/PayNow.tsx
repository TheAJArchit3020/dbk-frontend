// components/checkout/PayNow.tsx
"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/providers/cart";
import { useCustomer } from "@/providers/customer";
import { useCheckoutDraft } from "@/providers/checkout-draft";
import { sdk } from "@/lib/sdk";
import { useRouter } from "next/navigation";

export default function PayNow() {
  const { cart, refreshCart } = useCart();
  const { draft } = useCheckoutDraft();
  const { refresh: refreshCustomer } = useCustomer();
  const { syncToCart } = useCheckoutDraft();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isFail, setIsFail] = useState(false);
  const router = useRouter();

  const validate = (c: typeof cart) => {
    if (!c) return "No cart";
    if (!c.items?.length) return "Your cart is empty.";
    if (!c.email) return "Please add your email.";
    const phone = c.shipping_address?.phone || c.billing_address?.phone;
    if (!phone) return "Phone number is required in address.";
    if (!c.shipping_methods?.length) return "Please select a shipping method.";
    return null;
  };

  const precheckMsg = useMemo(() => validate(cart), [cart]);

  const placeOrder = async () => {
    setBusy(true);
    setErr(null);
    try {
      // 1) Commit draft (email/address) once, right now
      const next = await syncToCart();

      // 2) Validate after sync
      const fail = validate(next || cart);

      if (fail) {
        setErr(fail);
        setBusy(false);
        setIsFail(true);
        return;
      }
      setIsFail(false);

      // 3) Complete cart
      const data = await sdk.store.cart.complete((next || cart)!.id);

      if (data.type === "order" && data.order) {
        await refreshCustomer().catch(() => {});
        await refreshCart(); // clear old & spin new
        router.push(`/order/success?id=${data.order.id}`);
        return;
      }

      setErr(data?.error || "Could not complete order");
    } catch (e: any) {
      setErr(e?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <button
        onClick={placeOrder}
        disabled={!cart || busy}
        className="w-full rounded-md bg-primary px-4 py-3 text-white disabled:opacity-60"
      >
        {busy ? "Placing order…" : "Pay Now"}
      </button>

      {err && precheckMsg && (
        <p className="mt-2 text-sm text-red-600">{err || precheckMsg}</p>
      )}

      <p className="mt-2 text-xs text-text-mutable">
        By placing the order, you agree to our Terms &amp; Conditions.
      </p>
    </div>
  );
}
