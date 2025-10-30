"use client";

import { useState } from "react";
import { submitReview } from "@/lib/reviews";
import { useCustomer } from "@/providers/customer";

type ProductReviewsFormProps = {
  productId: string;
  open?: boolean; // controlled
  onOpenChange?: (v: boolean) => void; // controlled
};

// --- Star helper (24x24 viewbox) ---
const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z";

function StarIcon({
  fill = 0, // 0..1
  size = 24,
  activeFill = "fill-yellow-400",
  idleFill = "fill-gray-300 dark:fill-gray-600",
}: {
  fill?: number;
  size?: number;
  activeFill?: string;
  idleFill?: string;
}) {
  const clipId = Math.random().toString(36).slice(2);
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={STAR_PATH} />
        </clipPath>
      </defs>
      <path d={STAR_PATH} className={idleFill} />
      <g clipPath={`url(#${clipId})`}>
        <rect
          x="0"
          y="0"
          width={24 * clamped}
          height="24"
          className={activeFill}
        />
      </g>
    </svg>
  );
}

export default function ProductReviewsForm({
  productId,
  open,
  onOpenChange,
}: ProductReviewsFormProps) {
  const { customer } = useCustomer();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);

  // Controlled vs uncontrolled open state
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? !!open : internalOpen;
  const setOpen = isControlled ? onOpenChange ?? (() => {}) : setInternalOpen;

  // If not open, show a local open button (uncontrolled usage)
  if (!isOpen) {
    return (
      <div className="mt-8">
        {!isControlled && (
          <div className="flex justify-center">
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl border border-border bg-bg px-4 py-2 text-sm hover:bg-bg-dark"
            >
              Add a review
            </button>
          </div>
        )}
      </div>
    );
  }

  // If open but user not logged in, show a friendly nudge
  if (!customer) {
    return (
      <div className="mt-8 max-w-lg rounded-xl border border-border p-4 text-sm">
        <div className="mb-2 font-medium">
          You need to sign in to write a review.
        </div>
        <div className="text-text-mutable">Please log in and try again.</div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 text-sm underline"
        >
          Close
        </button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !content.trim()) {
      alert("Please provide a rating and content.");
      return;
    }
    setBusy(true);
    try {
      await submitReview({
        product_id: productId,
        title: title || undefined,
        content,
        rating,
        first_name: customer?.first_name || "",
        last_name: customer?.last_name || "",
      });
      alert("Thanks! Your review was submitted and awaits approval.");
      setOpen(false);
      setTitle("");
      setContent("");
      setRating(0);
    } catch (err) {
      console.error(err);
      alert("Could not submit review. Are you logged in?");
    } finally {
      setBusy(false);
    }
  }

  // --- Interactive stars state (hover preview + keyboard) ---
  const [hoverVal, setHoverVal] = useState<number | null>(null);
  const displayVal = hoverVal ?? rating;

  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRating((r) => Math.min(5, r + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRating((r) => Math.max(1, r - 1));
    }
  }

  return (
    <div className="mt-8 max-w-lg">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm">Title</label>
          <input
            className="w-full rounded-md border border-border bg-bg px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="(optional)"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Content</label>
          <textarea
            className="min-h-[100px] w-full rounded-md border border-border bg-bg px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* --- Star rating (replaces the old circles) --- */}
        <div>
          <label className="mb-1 block text-sm">Rating</label>
          <div
            role="radiogroup"
            aria-label="Rating"
            tabIndex={0}
            onKeyDown={handleKey}
            className="flex items-center gap-2"
            onMouseLeave={() => setHoverVal(null)}
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const fillAmount = Math.max(0, Math.min(1, displayVal - (n - 1)));
              const checked = rating === n;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  title={`${n} star${n > 1 ? "s" : ""}`}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverVal(n)}
                  onFocus={() => setHoverVal(n)}
                  onBlur={() => setHoverVal(null)}
                  onClick={() => setRating(n)}
                  className="p-0.5 rounded-md outline-none ring-0 focus:ring-2 focus:ring-yellow-400/50"
                >
                  <StarIcon fill={fillAmount} size={28} />
                </button>
              );
            })}
            <span className="ml-2 text-sm text-text-mutable">
              {rating ? `${rating}/5` : "Select"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="cursor-pointer rounded-xl border border-border bg-primary px-4 py-2 text-sm text-white disabled:opacity-60 hover:bg-secondary transition"
        >
          {busy ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-3 cursor-pointer text-sm underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
