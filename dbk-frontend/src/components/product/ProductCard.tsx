"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ProductCardProps = {
  href?: string;
  images: string[]; // /images/.. or remote URLs
  title: string;
  price: number; // current price
  compareAtPrice?: number; // old price (MRP)
  currency?: string; // default "₹"
  className?: string;
};

export default function ProductCard({
  href = "#",
  images,
  title,
  price,
  compareAtPrice,
  currency = "₹",
  className = "",
}: ProductCardProps) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cycleSpeed = 1000;
  const canCycle = images?.length > 1;

  useEffect(() => {
    // detect mobile (<= md)
    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(max-width: 767px)");
      const update = () => setIsMobile(mql.matches);
      update();
      mql.addEventListener?.("change", update);
      return () => mql.removeEventListener?.("change", update);
    }
  }, []);

  // autoplay on mobile, cycle while hovering on desktop
  useEffect(() => {
    if (!canCycle) return;

    const shouldPlay = isMobile || hovering;
    if (shouldPlay) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, cycleSpeed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      // when we stop (hover leave / unmount), reset to first image on desktop
      if (!isMobile) setIndex(0);
    };
  }, [hovering, isMobile, images.length, canCycle]);

  const percentOff = useMemo(() => {
    if (!compareAtPrice || compareAtPrice <= price) return null;
    const pct = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    return `${pct}%`;
  }, [price, compareAtPrice]);

  return (
    <Link
      href={href}
      aria-label={title}
      className={`min-w-0 w-full group block p-3 rounded-2xl transition hover:shadow-md ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      {/* Image box */}
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-bg">
        {/* Maintain 4:5-ish aspect without plugins */}
        <div className="pt-[125%]" />
        <div className="absolute inset-0">
          {images && images.length > 0 ? (
            images.map((src, i) => (
              <Image
                key={src + i}
                src={src}
                alt={title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={i === 0}
                className={`object-cover transition-opacity duration-300 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div className="absolute inset-0 grid place-items-center text-text-mutable">
              No image
            </div>
          )}
        </div>

        {/* % OFF bubble (always visible on mobile, on-hover on desktop) */}
      </div>

      {/* Title */}
      <h3 className="mt-3 min-h-[2.5rem] max-w-full font-medium text-text text-h2 leading-h2 line-clamp-1 [overflow-wrap:anywhere]">
        {title}
      </h3>

      {/* Price row */}
      <div className="mt-1 flex items-baseline gap-2 text-normal leading-normal">
        <span className=" font-normal text-text">
          {currency}
          {formatNumber(price)}
        </span>

        {compareAtPrice && compareAtPrice > price && (
          <div className="flex flex-row items-center gap-2 font-normal">
            <span
              className="
              text-text-mutable line-through decoration-2 decoration-dashed
              decoration-[var(--text-mutable)] font-normal
            "
            >
              {currency}
              {formatNumber(compareAtPrice)}
            </span>
            <div className="">
              <span className="inline-grid h-10 w-12 place-items-center rounded-full bg-primary text-white">
                -{percentOff}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function formatNumber(n: number) {
  // formats like 12,345 (you can swap to 'en-IN' if you prefer lakhs/crores)
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(n);
  }
}
