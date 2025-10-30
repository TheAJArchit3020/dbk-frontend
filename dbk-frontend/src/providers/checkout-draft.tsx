// providers/checkout-draft.tsx
"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";
import { useCart } from "./cart";

type DraftAddress = {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  postal_code?: string;
  city?: string;
  province?: string;
  company?: string;
  country_code?: string; // iso_2
  phone?: string;
};

type Draft = {
  email?: string;
  selectedCustomerAddressId?: string; // logged-in, picking saved
  manualAddress?: DraftAddress; // guest or custom address
};

type Ctx = {
  draft: Draft;
  setEmail: (v: string) => void;
  setSelectedAddressId: (id?: string) => void;
  setManualAddress: (a: DraftAddress) => void;

  /** Write email + address to cart just-in-time (e.g. before Pay Now or before fetching shipping options). */
  syncToCart: () => Promise<HttpTypes.StoreCart | undefined>;
};

const CheckoutDraftContext = createContext<Ctx | null>(null);

export function CheckoutDraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cart, setCart } = useCart();
  const [draft, setDraft] = useState<Draft>({});
  const syncing = useRef(false);

  const setEmail = (email: string) => setDraft((d) => ({ ...d, email }));
  const setSelectedAddressId = (id?: string) =>
    setDraft((d) => ({
      ...d,
      selectedCustomerAddressId: id,
      manualAddress: undefined,
    }));
  const setManualAddress = (a: DraftAddress) =>
    setDraft((d) => ({
      ...d,
      manualAddress: { ...d.manualAddress, ...a },
      selectedCustomerAddressId: undefined,
    }));

  const syncToCart = async () => {
    if (!cart || syncing.current) return cart;
    console.log("syncing");
    syncing.current = true;

    try {
      // 1) email
      let next = cart;
      if (draft.email && draft.email !== cart.email) {
        ({ cart: next } = await sdk.store.cart.update(cart.id, {
          email: draft.email,
        }));
      }

      // 2) address: either chosen saved address (copy fields) or manual form
      const makeAddress = async (): Promise<DraftAddress | undefined> => {
        if (draft.selectedCustomerAddressId) {
          try {
            return undefined;
          } catch {
            return undefined;
          }
        }
        if (draft.manualAddress) {
          console.log(draft.manualAddress);
          return draft.manualAddress;
        }
        return undefined;
      };

      const addr = await makeAddress();
      console.log(addr);
      if (
        addr &&
        addr.phone &&
        addr.address_1 &&
        addr.city &&
        addr.postal_code
      ) {
        const payload = { shipping_address: addr, billing_address: addr };
        ({ cart: next } = await sdk.store.cart.update(cart.id, payload));
      }

      setCart(next);
      return next;
    } finally {
      syncing.current = false;
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      draft,
      setEmail,
      setSelectedAddressId,
      setManualAddress,
      syncToCart,
    }),
    [draft]
  );

  return (
    <CheckoutDraftContext.Provider value={value}>
      {children}
    </CheckoutDraftContext.Provider>
  );
}

export function useCheckoutDraft() {
  const ctx = useContext(CheckoutDraftContext);
  if (!ctx)
    throw new Error(
      "useCheckoutDraft must be used within a CheckoutDraftProvider"
    );
  return ctx;
}
