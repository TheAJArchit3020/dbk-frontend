// components/checkout/ContactDetails.tsx
"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/providers/cart";
import { useCustomer } from "@/providers/customer";
import { useCheckoutDraft } from "@/providers/checkout-draft";

export default function ContactDetails() {
  const { cart } = useCart();
  const { customer } = useCustomer();
  const { setEmail } = useCheckoutDraft();
  const [email, setLocalEmail] = useState("");

  useEffect(() => {
    const seed = cart?.email || customer?.email || "";
    setLocalEmail(seed);
    setEmail(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.email, customer?.email]);

  return (
    <section className="rounded-xl border border-border bg-bg p-4">
      <h2 className="text-lg font-semibold">Contact Details</h2>
      <p className="text-sm text-text-mutable mt-1">
        {customer
          ? "You’re checking out as a registered customer."
          : "Guest checkout."}
      </p>

      <div className="mt-3">
        <label className="block text-sm text-text-mutable">Email</label>
        <input
          value={email}
          onChange={(e) => {
            setLocalEmail(e.target.value);
            setEmail(e.target.value.trim());
          }}
          type="email"
          className="mt-1 w-full rounded-lg border border-border bg-bg-dark px-3 py-2 outline-none focus:border-primary"
          placeholder="you@email.com"
        />
      </div>
    </section>
  );
}
