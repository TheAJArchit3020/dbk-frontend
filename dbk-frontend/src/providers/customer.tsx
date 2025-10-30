// providers/customer.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";
import { FetchError } from "@medusajs/js-sdk";

type CustomerCtx = {
  customer?: HttpTypes.StoreCustomer;
  loading: boolean;
  error?: string | null;

  // actions
  refresh: () => Promise<void>;
  updateProfile: (input: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
    phone?: string;
  }) => Promise<void>;

  addAddress: (input: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    company?: string;
    postal_code: string;
    city: string;
    province?: string;
    country_code: string; // iso_2 (e.g., "in", "us")
    phone: string;
  }) => Promise<void>;

  updateAddress: (
    id: string,
    input: {
      first_name?: string;
      last_name?: string;
      address_1?: string;
      address_2?: string;
      company?: string;
      postal_code?: string;
      city?: string;
      province?: string;
      country_code?: string;
      phone?: string;
    }
  ) => Promise<void>;

  deleteAddress: (id: string) => Promise<void>;

  logout: () => Promise<void>;
};

const CustomerContext = createContext<CustomerCtx | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer>();
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setErr(null);
      const { customer } = await sdk.store.customer.retrieve();
      setCustomer(customer);
    } catch (e) {
      const fe = e as FetchError;
      // 401 just means "not logged in" → keep undefined silently
      if (fe?.status !== 401) setErr(fe?.message || "Failed to load customer");
      setCustomer(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfile: CustomerCtx["updateProfile"] = async (input) => {
    if (!customer) return;
    const { customer: updatedCustomer } = await sdk.store.customer.update({
      ...input,
    });
    setCustomer(updatedCustomer);
  };

  const addAddress: CustomerCtx["addAddress"] = async (input) => {
    const { customer: updated } = await sdk.store.customer.createAddress({
      ...input,
    });
    setCustomer(updated);
  };

  const updateAddress: CustomerCtx["updateAddress"] = async (id, input) => {
    const { customer: updated } = await sdk.store.customer.updateAddress(id, {
      ...input,
    });
    setCustomer(updated);
  };

  const deleteAddress: CustomerCtx["deleteAddress"] = async (id) => {
    const { parent: updated } = await sdk.store.customer.deleteAddress(id);
    // API returns { parent: customer }
    setCustomer(updated as unknown as HttpTypes.StoreCustomer);
  };

  const logout = async () => {
    try {
      await sdk.auth.logout();
    } finally {
      setCustomer(undefined);
    }
  };

  const value = useMemo<CustomerCtx>(
    () => ({
      customer,
      loading,
      error,
      refresh,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      logout,
    }),
    [customer, loading, error]
  );

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx)
    throw new Error("useCustomer must be used within a CustomerProvider");
  return ctx;
}
