// app/checkout/confirm/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactDetails from "@/components/checkout/ContactDetails";
import AddressChooser from "@/components/checkout/AddressChooser";
import ShippingPicker from "@/components/checkout/ShippingPicker";
import OrderSummary from "@/components/checkout/OrderSumarry";
import PayNow from "@/components/checkout/PayNow";
import { useCart } from "@/providers/cart";
import { useCustomer } from "@/providers/customer";
import { useEffect } from "react";
import Link from "next/link";
import { CheckoutDraftProvider } from "@/providers/checkout-draft";
import ProfileNavbar from "@/components/ProfileNabar";

export default function ConfirmOrderPage() {
  const { cart } = useCart();
  const { customer } = useCustomer();

  // If cart is empty, steer them out
  const empty = !cart || !cart.items || cart.items.length === 0;

  return (
    <CheckoutDraftProvider>
      <ProfileNavbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Confirm your order
          </h1>

          {empty ? (
            <div className="mt-6 text-sm text-text-mutable">
              Your cart is empty.{" "}
              <Link className="underline" href="/">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: customer + address + shipping */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1) Contact details (email + phone) */}
                <ContactDetails />

                {/* 2) Address (select or form). Phone is also validated here. */}
                <AddressChooser />

                {/* 3) Shipping method picker */}
                <ShippingPicker />
              </div>

              {/* Right: order summary + promos + pay */}
              <div className="lg:col-span-1">
                <OrderSummary />
                <div className="mt-4">
                  <PayNow />
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </CheckoutDraftProvider>
  );
}
