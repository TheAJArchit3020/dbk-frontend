"use client";

import { useCallback, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import type { Address } from "@/components/profile/AddressList";
import AuthGate from "@/components/auth/AuthGate";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import type { HttpTypes } from "@medusajs/types";
import ProfileNavbar from "@/components/ProfileNabar";

export default function ProfilePage() {
  // UI state
  const [authedCustomer, setAuthedCustomer] =
    useState<HttpTypes.StoreCustomer | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleAuthed = useCallback((c: HttpTypes.StoreCustomer) => {
    setAuthedCustomer(c);
    setChecked(true);
  }, []);

  const handleUnauthed = useCallback(() => {
    setAuthedCustomer(null);
    setChecked(true);
  }, []);

  // Example fallback data if not yet loaded; ProfileView expects props
  const name = useMemo(() => {
    if (!authedCustomer) return "Guest";
    const fn = authedCustomer.first_name || "";
    const ln = authedCustomer.last_name || "";
    return [fn, ln].filter(Boolean).join(" ") || authedCustomer.email;
  }, [authedCustomer]);

  const email = authedCustomer?.email || "";
  const addresses: Address[] = [];

  const countries = ["India", "United States", "Canada"];
  const states = ["Maharashtra", "Karnataka", "Delhi", "Gujarat"];

  return (
    <>
      <Navbar />

      {/* This tries token-based auth once, then calls back */}
      {!checked && (
        <AuthGate
          onAuthenticated={handleAuthed}
          onUnauthenticated={handleUnauthed}
        />
      )}

      {/* When not authenticated, show Login / Register picker */}
      {checked && !authedCustomer && (
        <div className="max-w-md mx-auto p-4 space-y-6">
          {!showRegister ? (
            <>
              <LoginForm onSuccess={() => window.location.reload()} />
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <button
                  className="underline"
                  onClick={() => setShowRegister(true)}
                >
                  Create one
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={() => setShowRegister(false)} />
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  className="underline"
                  onClick={() => setShowRegister(false)}
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      )}

      {/* When authenticated, show the real profile */}
      {checked && authedCustomer && (
        <div className="max-w-3xl mx-auto">
          <ProfileView
            countries={countries}
            states={states}
            defaultCountry="India"
            defaultState="Maharashtra"
          />
        </div>
      )}
    </>
  );
}
