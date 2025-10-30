// app/search/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/product/ProductCard";

function toAbsoluteMediaUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  const base =
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/+$/, "") ||
    "";
  return base ? `${base}${url}` : url;
}

function extractPrices(p: HttpTypes.StoreProduct) {
  const rows = (p.variants || [])
    .map((v: any) => {
      const calc = v?.calculated_price;
      const isSale = calc?.calculated_price?.price_list_type === "sale";
      const price = Number(
        calc?.calculated_amount_with_tax ?? calc?.calculated_amount ?? NaN
      );
      const compare = isSale
        ? Number(calc?.original_amount_with_tax ?? calc?.original_amount ?? NaN)
        : NaN;
      const currency =
        calc?.currency_code ||
        v?.prices?.[0]?.currency_code ||
        (p as any)?.currency_code ||
        "INR";
      return { price, compare, currency };
    })
    .filter((x) => Number.isFinite(x.price));

  if (!rows.length)
    return { price: 0, compareAtPrice: undefined, currency: "₹" };

  const best = rows.reduce((a, b) => (b.price < a.price ? b : a), rows[0]);
  const toMajor = (n: number) => n;

  return {
    price: toMajor(best.price),
    compareAtPrice: Number.isFinite(best.compare)
      ? toMajor(best.compare)
      : undefined,
    currency: best.currency?.toUpperCase() === "INR" ? "₹" : "₹",
  };
}

export default function SearchPage() {
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  // refetch when q changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setLoading(true);
  }, [q]);

  // fetch on (q, page)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const offset = (page - 1) * limit;
      const { products: data, count: total } = await sdk.store.product.list({
        q: q || undefined,
        limit,
        offset,
        fields: "id,title,handle,images.*,metadata,*variants.calculated_price",
      });
      if (cancelled) return;
      setProducts((prev) => (page === 1 ? data : [...prev, ...data]));
      setCount(total ?? data.length);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [q, page]);

  const hasMore = useMemo(
    () => count > products.length,
    [count, products.length]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1">
        <div className="mb-4 text-sm text-text-mutable">
          {q ? (
            <>
              Showing results for{" "}
              <span className="font-medium text-text">“{q}”</span>
              {count ? ` — ${count} item${count > 1 ? "s" : ""}` : ""}
            </>
          ) : (
            <>All products</>
          )}
        </div>

        {loading && products.length === 0 && (
          <div className="text-sm text-text-mutable">Loading…</div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-sm text-text-mutable">No products found.</div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => {
              const images = (p.images || [])
                .map((im) => toAbsoluteMediaUrl(im.url))
                .filter(Boolean) as string[];
              const { price, compareAtPrice, currency } = extractPrices(p);
              return (
                <ProductCard
                  key={p.id}
                  href={`/product/${p.handle ?? p.id}`}
                  images={images}
                  title={p.title}
                  price={price}
                  compareAtPrice={compareAtPrice}
                  currency={currency}
                />
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="rounded-xl border border-border px-5 py-2 text-sm
                         bg-bg hover:bg-bg-dark transition disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
