// components/checkout/OrderSummary.tsx
"use client";

import { useCart } from "@/providers/cart";
import CartPromotions from "@/components/cart/CartPromotions";

export default function OrderSummary() {
  const { cart } = useCart();
  if (!cart) return null;

  const fmt = (n?: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cart.currency_code || "INR",
    }).format(n || 0);

  return (
    <aside className="rounded-xl border border-border bg-bg p-4">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* items */}
      <ul className="mt-3 divide-y divide-border">
        {cart.items?.map((it) => (
          <li
            key={it.id}
            className="py-2 flex items-start justify-between gap-3"
          >
            <div>
              <div className="text-sm font-medium">{it.title}</div>
              <div className="text-xs text-text-mutable">
                Qty {it.quantity}{" "}
                {it.variant?.title ? `• ${it.variant.title}` : ""}
              </div>
            </div>
            <div className="text-sm">{fmt(it.total ?? it.unit_price)}</div>
          </li>
        ))}
      </ul>

      {/* promos apply/remove */}
      <CartPromotions />

      {/* totals */}
      <div className="mt-4 border-t border-border pt-3 space-y-1 text-sm">
        <Row label="Subtotal (excl. taxes)" value={fmt(cart.subtotal ?? 0)} />
        <Row label="Discounts" value={fmt(cart.discount_total ?? 0)} />
        <Row label="Shipping" value={fmt(cart.shipping_total ?? 0)} />
        <Row label="Taxes" value={fmt(cart.tax_total ?? 0)} />
        <div className="flex items-center justify-between pt-2 font-semibold">
          <span>Total</span>
          <span>{fmt(cart.total ?? 0)}</span>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-mutable">{label}</span>
      <span>{value}</span>
    </div>
  );
}
