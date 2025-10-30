"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/sdk"; // your SDK init from earlier
import type { HttpTypes } from "@medusajs/types";
import CategoriesRow from "./sections/Categories";

type Props = {
  q?: string; // optional search
  limit?: number; // pagination size
  order?: string; // e.g. "-name"
  className?: string;
};

export default function CategoriesFetcher({
  q,
  limit = 20,
  order,
  className,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const offset = (page - 1) * limit;
        const { product_categories, count } = await sdk.store.category.list({
          q,
          limit,
          offset,
          order,
        });
        if (cancelled) return;

        setCategories((prev) => {
          // avoid duplicates if re-fetched
          const seen = new Set(prev.map((p) => p.id));
          const next = [...prev];
          for (const c of product_categories) {
            if (!seen.has(c.id)) next.push(c);
          }
          return next;
        });
        setHasMore(count > page * limit);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [q, limit, order, page]);

  return (
    <div className={className}>
      {loading && categories.length === 0 && (
        <div className="px-3 py-2 text-sm text-text-mutable">Loading…</div>
      )}

      {categories.length > 0 && <CategoriesRow categories={categories} />}

      {!loading && categories.length === 0 && (
        <div className="px-3 py-2 text-sm text-text-mutable">
          No categories.
        </div>
      )}

      {!loading && hasMore && (
        <div className="px-3 py-3">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border bg-bg px-4 py-2 text-sm hover:bg-bg-dark/60"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
