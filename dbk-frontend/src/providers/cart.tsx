"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";
import { useRegion } from "./region";

type CartCtx = {
  cart?: HttpTypes.StoreCart;
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  >;
  // line item ops
  addLine: (variantId: string, qty?: number) => Promise<void>;
  updateLine: (itemId: string, qty: number) => Promise<void>;
  removeLine: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { region } = useRegion();
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const [isOpen, setOpen] = useState(false);

  // create/retrieve once region known
  useEffect(() => {
    if (!region || cart) return;
    const id = localStorage.getItem("cart_id");
    const fields = "+items.*,+shipping_methods.*"; // include item totals if you want
    if (!id) {
      sdk.store.cart
        .create({ region_id: region.id })
        .then(({ cart }) => {
          localStorage.setItem("cart_id", cart.id);
          // retrieve expanded
          return sdk.store.cart.retrieve(cart.id, { fields });
        })
        .then(({ cart }) => setCart(cart));
    } else {
      sdk.store.cart.retrieve(id, { fields }).then(({ cart }) => setCart(cart));
    }
  }, [region, cart]);

  // helpers
  const addLine = async (variantId: string, qty = 1) => {
    const id = localStorage.getItem("cart_id");
    if (!id) return;
    const { cart: next } = await sdk.store.cart.createLineItem(id, {
      variant_id: variantId,
      quantity: qty,
    });
    setCart(next);
    setOpen(true);
  };

  const updateLine = async (itemId: string, quantity: number) => {
    const id = localStorage.getItem("cart_id");
    if (!id) return;
    const { cart: next } = await sdk.store.cart.updateLineItem(id, itemId, {
      quantity,
    });
    setCart(next);
  };

  const removeLine = async (itemId: string) => {
    const id = localStorage.getItem("cart_id");
    if (!id) return;
    const { parent: next } = await sdk.store.cart.deleteLineItem(id, itemId);
    setCart(next);
  };
  const createFreshCart = async (regionId: string) => {
    const { cart } = await sdk.store.cart.create({ region_id: regionId });
    localStorage.setItem("cart_id", cart.id);
    const fields = "+items.*,+shipping_methods.*";
    const { cart: full } = await sdk.store.cart.retrieve(cart.id, { fields });
    setCart(full);
  };

  // expose refresh method to clear old cart & spin a fresh one
  const refreshCart = async () => {
    const regionId = region?.id;
    localStorage.removeItem("cart_id");
    setCart(undefined);
    if (regionId) await createFreshCart(regionId);
  };
  const value = useMemo<CartCtx>(
    () => ({
      cart,
      setCart,
      addLine,
      updateLine,
      removeLine,
      refreshCart, // <-- expose
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [cart, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
