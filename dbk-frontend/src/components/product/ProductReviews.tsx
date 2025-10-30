"use client";

import { useEffect, useState } from "react";
import { fetchProductReviews, type StoreProductReview } from "@/lib/reviews";
import ProductReviewsForm from "./ProductReviewsForm";

type StarsProps = {
  value: number; // 0–5, decimals allowed
  size?: number; // px size per star
  gapClass?: string; // tailwind gap override (e.g. "gap-1.5")
  activeFill?: string; // tailwind color class for filled area
  idleFill?: string; // tailwind color class for empty star
};

export function Stars({
  value,
  size = 16,
  gapClass = "gap-1",
  activeFill = "fill-yellow-400",
  idleFill = "fill-gray-300 dark:fill-gray-600",
}: StarsProps) {
  const stars = [1, 2, 3, 4, 5];

  // Material-style star path (24x24 viewbox)
  const d =
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z";

  return (
    <div
      className={`flex ${gapClass}`}
      role="img"
      aria-label={`${Math.max(0, Math.min(5, value)).toFixed(
        1
      )} out of 5 stars`}
    >
      {stars.map((n) => {
        // fillAmount: 0..1 for this star
        const fillAmount = Math.max(0, Math.min(1, value - (n - 1)));
        const clipId = `starClip-${n}`;

        return (
          <svg
            key={n}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="block"
          >
            <defs>
              <clipPath id={clipId}>
                <path d={d} />
              </clipPath>
            </defs>

            {/* Empty star (background) */}
            <path d={d} className={idleFill} />

            {/* Filled portion, clipped to star shape */}
            <g clipPath={`url(#${clipId})`}>
              <rect
                x="0"
                y="0"
                width={24 * fillAmount}
                height="24"
                className={activeFill}
              />
            </g>
          </svg>
        );
      })}
    </div>
  );
}

function ReviewCard({ r }: { r: StoreProductReview }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{r.title}</div>
        <Stars value={r.rating} />
      </div>
      <p className="mt-2 text-sm">{r.content}</p>
      <div className="mt-3 text-xs text-text-mutable">
        {r.first_name} {r.last_name}
      </div>
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<StoreProductReview[]>([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const limit = 10;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        reviews,
        average_rating,
        count,
        limit: take,
      } = await fetchProductReviews(productId, page, limit);
      if (cancelled) return;
      setReviews((prev) => {
        const newOnes = reviews.filter((r) => !prev.some((p) => p.id === r.id));
        return [...prev, ...newOnes];
      });
      setAvg(Math.round(average_rating));
      setCount(count);
      setHasMore(count > take * page);
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, page]);

  return (
    <section className="mt-12">
      <div className="flex flex-col items-start text-center mb-8">
        <div className="text-sm text-text-mutable mb-2">Product Reviews</div>
        <div className="text-xl font-semibold">What customers are saying</div>
        <div className="mt-2 flex items-center gap-3">
          <Stars value={avg} />
          <span className="text-sm text-text-mutable">{count} reviews</span>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="mt-4 text-white bg-primary px-4 py-2 text-sm hover:bg-secondary cursor-pointer transition drop-shadow"
        >
          Write a review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center text-sm text-text-mutable">
          No reviews yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-border px-4 py-2 text-sm bg-bg hover:bg-bg-dark"
          >
            Load more
          </button>
        </div>
      )}
      <ProductReviewsForm
        productId={productId}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </section>
  );
}
