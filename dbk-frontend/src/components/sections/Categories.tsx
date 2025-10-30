"use client";

import Link from "next/link";
import type { HttpTypes } from "@medusajs/types";

type Props = {
  categories: HttpTypes.StoreProductCategory[];
  className?: string;
  // If you want to override the link destination, provide a builder:
  hrefFor?: (c: HttpTypes.StoreProductCategory) => string;
};

export default function CategoriesRow({
  categories,
  className = "",
  hrefFor = (c) => `/categories/${c.handle ?? c.id}`, // adjust to your routes
}: Props) {
  if (!categories?.length) {
    return (
      <div className="text-sm text-text-mutable px-2">No categories found.</div>
    );
  }

  return (
    <div
      className={[
        "bg-bg-dark px-3 py-2 justify-center",
        "flex gap-3 overflow-x-auto",
        "whitespace-nowrap scrollbar-thin",
        className,
      ].join(" ")}
    >
      {categories.map((c) => (
        <Link
          key={c.id}
          href={hrefFor(c)}
          className="
            inline-flex items-center
            bg-bg px-4 py-2 text-normal text-text 
            transition whitespace-nowrap
          "
          title={c.name}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
