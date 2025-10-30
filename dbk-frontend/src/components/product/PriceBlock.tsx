"use client";

import type { HttpTypes } from "@medusajs/types";
import { useMemo } from "react";

type Props = {
  product: HttpTypes.StoreProduct;
  selectedVariant?: HttpTypes.StoreProductVariant;
};

function formatINR(n?: number) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);
}

export default function PriceBlock({ product, selectedVariant }: Props) {
  // prefer selected variant price; else first variant; else product (fallback)
  const variant = selectedVariant ?? product.variants?.[0];

  const calc = variant?.calculated_price;
  const isSale = calc?.calculated_price?.price_list_type === "sale";
  const price =
    calc?.calculated_amount_with_tax ?? calc?.calculated_amount ?? undefined;
  const original = isSale
    ? calc?.original_amount_with_tax ?? calc?.original_amount
    : undefined;
  const percentOff = useMemo(() => {
    if (!original || original <= price!) return null;
    const pct = Math.round(((original - price!) / original) * 100);
    return `${pct}%`;
  }, [price, original]);
  return (
    <div className="flex flex-col items-baseline">
      <div className="flex flex-row gap-3 items-baseline">
        {original && original > (price || 0) && (
          <div className="text-normal text-text-mutable line-through">
            {formatINR(original)}
          </div>
        )}
        <div className="text-2xl font-semibold text-text">
          {formatINR(price)}
        </div>
        {original && original > (price || 0) && (
          <div className="">
            <span className="inline-grid px-2 place-items-center rounded-full bg-primary text-white">
              Save {percentOff}
            </span>
          </div>
        )}
      </div>
      <div className="text-normal">
        <span>tax included</span>
      </div>
    </div>
  );
}
