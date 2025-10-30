"use client";

import type { HttpTypes } from "@medusajs/types";
import ProductCard from "./ProductCard";

type Props = {
  products: HttpTypes.StoreProduct[];
};

/** Make /static/... absolute using env; leave absolute URLs as-is */
function toAbsoluteMediaUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/+$/, "") ||
    "";
  return base ? `${base}${url}` : url;
}

/** Best-effort price extractor (handles common Medusa v2 shapes) */
function extractPrices(p: HttpTypes.StoreProduct) {
  // pick lowest variant price (if multiple variants)
  const amounts = (p.variants || [])
    .map((v: any) => {
      const cp =
        v?.calculated_price ||
        v?.calculated_price_incl_tax ||
        v?.calculated_price_excl_tax;
      const price = Number(
        cp?.calculated_amount ??
          cp?.amount ??
          v?.amount ??
          v?.prices?.[0]?.amount ??
          NaN
      );
      const compare = Number(
        cp?.calculated_compare_at_amount ??
          cp?.compare_at_amount ??
          v?.compare_at_amount ??
          v?.prices?.[0]?.compare_at_amount ??
          NaN
      );
      const currency = cp?.currency_code;
      return { price, compare, currency };
    })
    .filter((x) => Number.isFinite(x.price));

  if (amounts.length === 0) {
    return { price: 0, compareAtPrice: undefined, currency: "INR" };
  }

  // choose the min price entry
  const best = amounts.reduce(
    (a, b) => (b.price < a.price ? b : a),
    amounts[0]
  );
  const symbol = best.currency?.toUpperCase() === "INR" ? "₹" : ""; // tweak as you like
  return {
    price: best.price, // assuming amounts are in minor units
    compareAtPrice: Number.isFinite(best.compare) ? best.compare : undefined,
    currency: symbol || "₹",
  };
}

export default function RelatedProducts({ products }: Props) {
  if (!products?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => {
        const imgs = (p.images || [])
          .map((im) => toAbsoluteMediaUrl(im.url))
          .filter(Boolean) as string[];

        const { price, compareAtPrice, currency } = extractPrices(p);

        return (
          <ProductCard
            key={p.id}
            href={`/product/${p.handle ?? p.id}`}
            images={imgs}
            title={p.title}
            price={price}
            compareAtPrice={compareAtPrice}
            currency={currency}
          />
        );
      })}
    </div>
  );
}
