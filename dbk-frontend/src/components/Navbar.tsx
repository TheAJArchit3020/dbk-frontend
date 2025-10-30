// components/Navbar.tsx
"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CategoriesFetcher from "./CategoriesFetcher";
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

export default function Navbar() {
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim();
  const { open, cart } = useCart();

  const count = cart?.items?.reduce((n, it) => n + (it.quantity ?? 0), 0) ?? 0;

  return (
    <header className="sticky top-0 z-40 border-text border-b bg-bg-light w-full">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-8 justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/dbk_logo.png"
            alt="Dhaga by Komal"
            width={160}
            height={40}
            className="h-20 w-auto"
            priority
          />
          <span className="sr-only">Dhaga by Komal</span>
        </Link>

        <form
          className="mx-4 max-w-7xl hidden flex-1 md:block"
          role="search"
          action="/search"
          method="GET"
        >
          <label htmlFor="global-search" className="sr-only">
            Search Dhaga by Komal
          </label>
          <input
            id="global-search"
            name="q"
            type="search"
            placeholder="Search Dhaga By Komal"
            defaultValue={q}
            className="w-full rounded-2xl border border-border bg-bg-dark px-5 py-3 text-text placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <div className="flex items-center gap-8">
          <Link
            href="/profile"
            className="group grid place-items-center"
            aria-label="Profile"
            title="Profile"
          >
            <UserCircleIcon className="h-7 w-7 text-textMutable transition-colors group-hover:text-bg" />
          </Link>

          <button
            onClick={open}
            className="group relative grid place-items-center cursor-pointer"
            aria-label="Cart"
            title="Cart"
          >
            {count > 0 && (
              <span className="absolute -right-1 -top-1 min-h-5 min-w-5 rounded-full bg-primary px-1 text-[11px] leading-5 text-white">
                {count}
              </span>
            )}
            <CartIcon className="h-7 w-7 text-textMutable transition-colors group-hover:text-bg" />
          </button>
        </div>
      </div>
      <CategoriesFetcher limit={30} order="name" />
    </header>
  );
}
