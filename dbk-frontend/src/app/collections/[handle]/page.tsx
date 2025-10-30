"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/product/ProductCard";

/** Uses calculated_price; shows compare only for sale list prices */
function extractPrices(p: HttpTypes.StoreProduct) {
  const rows =
    (p.variants || [])
      .map((v: any) => {
        const calc = v?.calculated_price;
        const isSale = calc?.calculated_price?.price_list_type === "sale";
        const price = Number(
          calc?.calculated_amount_with_tax ?? calc?.calculated_amount ?? NaN
        );
        const compare = isSale
          ? Number(
              calc?.original_amount_with_tax ?? calc?.original_amount ?? NaN
            )
          : NaN;
        const currency =
          calc?.currency_code ||
          v?.prices?.[0]?.currency_code ||
          (p as any)?.currency_code ||
          "INR";
        return { price, compare, currency };
      })
      .filter((x) => Number.isFinite(x.price)) || [];

  if (!rows.length)
    return { price: 0, compareAtPrice: undefined, currency: "₹" };

  const best = rows.reduce((a, b) => (b.price < a.price ? b : a), rows[0]);
  const toMajor = (n: number) => n; // keep as-is, assuming amounts already in major units

  return {
    price: toMajor(best.price),
    compareAtPrice: Number.isFinite(best.compare)
      ? toMajor(best.compare)
      : undefined,
    currency: best.currency?.toUpperCase() === "INR" ? "₹" : "₹",
  };
}

export default function CollectionPage() {
  const params = useParams<{ handle: string }>();
  const handle = params?.handle;

  const [loading, setLoading] = useState(true);
  const [collection, setCollection] =
    useState<HttpTypes.StoreCollection | null>(null);
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Load collection by handle
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { collections } = await sdk.store.collection.list({
        handle,
        limit: 1,
        fields: "id,title,handle,created_at",
      });

      if (cancelled) return;

      const col = collections?.[0] ?? null;
      setCollection(col);
      setProducts([]);
      setCount(0);
      setPage(1);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  // Fetch products of collection
  useEffect(() => {
    if (!collection?.id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const offset = (page - 1) * limit;

      const { products: data, count: total } = await sdk.store.product.list({
        collection_id: collection.id,
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
  }, [collection?.id, page]);

  const hasMore = useMemo(
    () => count > products.length,
    [count, products.length]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1">
        {!collection && !loading && (
          <div className="text-sm text-text-mutable">Collection not found.</div>
        )}

        {collection && (
          <>
            <h1 className="text-2xl md:text-3xl font-semibold text-text mb-2">
              {collection.title}
            </h1>
            <div className="mb-4 text-sm text-text-mutable">
              {count
                ? `${count} item${count > 1 ? "s" : ""}`
                : loading
                ? "Loading…"
                : "No products found."}
            </div>

            {!!products.length && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((p) => {
                  const images = (p.images || [])
                    .map((im) => im.url)
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
                  className="rounded-xl border border-border px-5 py-2 text-sm bg-bg hover:bg-bg-dark transition disabled:opacity-60"
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
