// components/product/AddToCart.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/providers/cart";

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 5h2l2.2 10.5a1.5 1.5 0 0 0 1.47 1.2h8.5a1.5 1.5 0 0 0 1.46-1.12L21 8H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19.5" r="1.25" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

type Props = {
  productId: string;
  variantId?: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  variantId,
  disabled,
}: Props) {
  const { addLine } = useCart();
  const [busy, setBusy] = useState(false);
  const canAdd = !!variantId && !busy && !disabled;

  const add = async () => {
    if (!variantId) return;
    setBusy(true);
    try {
      await addLine(variantId, 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={add}
      disabled={!canAdd}
      className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-[#C9302A] to-[#A12C35] px-4 py-3 text-white disabled:opacity-60 gap-2 text-h2"
    >
      {busy ? "Adding…" : "Add to cart"} <CartIcon className="h-7 w-7" />
    </button>
  );
}
