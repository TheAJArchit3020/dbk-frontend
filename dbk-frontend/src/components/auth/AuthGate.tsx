"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/sdk";
import type { HttpTypes } from "@medusajs/types";
import { FetchError } from "@medusajs/js-sdk";

type AuthGateProps = {
  onAuthenticated: (customer: HttpTypes.StoreCustomer) => void;
  onUnauthenticated: () => void;
};

export default function AuthGate({
  onAuthenticated,
  onUnauthenticated,
}: AuthGateProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a JWT token is present in localStorage, the SDK will send it automatically.
    // We simply try to retrieve the current customer.
    const probe = async () => {
      try {
        const { customer } = await sdk.store.customer.retrieve();
        onAuthenticated(customer);
      } catch (e) {
        const err = e as FetchError;
        // 401/Unauthorized means no valid session/token → force login/register
        if (err?.status === 401) {
          onUnauthenticated();
        } else {
          // Other errors: also go unauthenticated for now
          onUnauthenticated();
        }
      } finally {
        setLoading(false);
      }
    };
    probe();
  }, [onAuthenticated, onUnauthenticated]);

  if (loading)
    return <div className="p-4 text-sm text-gray-500">Checking session…</div>;
  return null; // This component only triggers callbacks; render nothing
}
