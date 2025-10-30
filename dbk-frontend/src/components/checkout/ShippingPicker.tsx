// components/checkout/ShippingPicker.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/providers/cart";
import { useCheckoutDraft } from "@/providers/checkout-draft";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";

export default function ShippingPicker() {
  const { cart, setCart } = useCart();
  const { syncToCart } = useCheckoutDraft();

  const [options, setOptions] = useState<HttpTypes.StoreCartShippingOption[]>(
    []
  );
  const [calc, setCalc] = useState<Record<string, number>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  // Current selection from cart (if any)
  const selectedFromCart = useMemo(
    () => cart?.shipping_methods?.[0]?.shipping_option_id,
    [cart]
  );

  // Ensure the backend has an address before asking for shipping options
  useEffect(() => {
    if (!cart) return;
    if (!cart.shipping_address && !cart.billing_address) {
      // we’re still in “commit-once”: only push address/email, not shipping
      syncToCart().catch(() => {});
    }
  }, [cart]);

  // Load shipping options
  useEffect(() => {
    if (!cart) return;
    sdk.store.fulfillment
      .listCartOptions({ cart_id: cart.id })
      .then(({ shipping_options }) => setOptions(shipping_options || []));
  }, [cart]);

  // Calculate prices for "calculated" options
  useEffect(() => {
    if (!cart || !options.length) return;
    const promises = options
      .filter((o) => o.price_type === "calculated")
      .map((o) => sdk.store.fulfillment.calculate(o.id, { cart_id: cart.id }));
    if (!promises.length) return;

    Promise.allSettled(promises).then((res) => {
      const m: Record<string, number> = {};
      res.forEach((r: any) => {
        if (r.status === "fulfilled") {
          const so = r.value?.shipping_option;
          if (so?.id && typeof so.amount === "number") m[so.id] = so.amount;
        }
      });
      setCalc(m);
    });
  }, [cart, options]);

  const priceFor = (o: HttpTypes.StoreCartShippingOption) =>
    o.price_type === "flat" ? o.amount : calc[o.id];

  const format = (n?: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cart?.currency_code || "INR",
    }).format(n || 0);

  const handleSelect = async (optionId: string) => {
    if (!cart) return;
    // Prevent double-tap while switching
    setBusyId(optionId);
    try {
      const { cart: next } = await sdk.store.cart.addShippingMethod(cart.id, {
        option_id: optionId,
      });
      setCart(next);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-bg p-4">
      <h2 className="text-lg font-semibold">Shipping</h2>

      {!options.length ? (
        <p className="mt-2 text-sm text-text-mutable">
          No shipping options yet.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {options.map((o) => {
            const p = priceFor(o);
            const priceReady = typeof p === "number";
            const checked = selectedFromCart === o.id;
            const disabled = !priceReady || (!!busyId && busyId !== o.id);

            return (
              <label
                key={o.id}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                  checked ? "border-primary" : "border-border"
                } ${!priceReady ? "opacity-60" : ""}`}
              >
                <span className="text-sm">{o.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    {priceReady ? format(p) : "…"}
                  </span>
                  <input
                    type="radio"
                    name="ship"
                    value={o.id}
                    disabled={disabled}
                    checked={checked}
                    onChange={() => handleSelect(o.id)}
                  />
                </div>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}
