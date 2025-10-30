// components/profile/ProfileView.tsx
"use client";

import { useMemo, useState } from "react";
import ProfileInfoCard from "./ProfileInfoCard";
import AddressList from "./AddressList";
import EditProfileSheet from "./EditProfileSheet";
import AddAddressModal from "./AddAdressModal";
import { useCustomer } from "@/providers/customer";
import { useRegion } from "@/providers/region";

type Props = {
  // Keep your props if you want, but we'll prioritize live data from provider
  countries: string[];
  states: string[];
  defaultCountry?: string;
  defaultState?: string;
};

export default function ProfileView({
  countries,
  states,
  defaultCountry = "India",
  defaultState = "Maharashtra",
}: Props) {
  const { customer, updateProfile, addAddress, deleteAddress, loading } =
    useCustomer();
  const { region } = useRegion();

  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const displayName = useMemo(() => {
    const fn = customer?.first_name || "";
    const ln = customer?.last_name || "";
    return [fn, ln].filter(Boolean).join(" ") || customer?.email || "Guest";
  }, [customer]);

  // Map Medusa addresses → your AddressList shape
  const addresses = useMemo(
    () =>
      (customer?.addresses || []).map((a) => ({
        id: a.id!,
        firstName: a.first_name || "",
        lastName: a.last_name || "",
        address1: a.address_1 || "",
        address2: a.address_2 || "",
        city: a.city || "",
        state: a.province || "",
        pinCode: a.postal_code || "",
        phone: a.phone || "",
        country: a.country_code?.toUpperCase() || "",
      })),
    [customer?.addresses]
  );

  // Helper: best-effort map a country name → iso_2; else region first
  const resolveCountryCode = (incoming: string | undefined): string => {
    const fromRegion =
      region?.countries?.find(
        (c) =>
          c.display_name?.toLowerCase() === (incoming || "").toLowerCase() ||
          c.iso_2?.toLowerCase() === (incoming || "").toLowerCase()
      )?.iso_2 || region?.countries?.[0]?.iso_2;

    return (fromRegion || "in").toLowerCase();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
      <h1 className="mb-4 text-lg md:text-xl font-semibold text-gray-900">
        Profile
      </h1>

      {loading && <p className="text-sm text-gray-600">Loading profile…</p>}

      {!loading && (
        <>
          <div className="space-y-4">
            <ProfileInfoCard
              name={displayName}
              email={customer?.email || ""}
              onEdit={() => setShowEdit(true)}
            />

            <AddressList addresses={addresses} onAdd={() => setShowAdd(true)} />
          </div>

          {/* Edit Profile */}
          <EditProfileSheet
            open={showEdit}
            onClose={() => setShowEdit(false)}
            onSave={async (v) => {
              await updateProfile({
                first_name: v.firstName,
                last_name: v.lastName,
              });
              setShowEdit(false);
            }}
            firstName={customer?.first_name || ""}
            lastName={customer?.last_name || ""}
            email={customer?.email || ""}
          />

          {/* Add Address */}
          <AddAddressModal
            open={showAdd}
            onClose={() => setShowAdd(false)}
            onSave={async (addr: any) => {
              // Your modal returns { firstName, lastName, address1, address2, city, state, pinCode, phone, country }
              await addAddress({
                first_name: String(addr.firstName || ""),
                last_name: String(addr.lastName || ""),
                address_1: String(addr.address1 || ""),
                address_2: String(addr.address2 || ""),
                city: String(addr.city || ""),
                province: String(addr.state || ""),
                postal_code: String(addr.pinCode || ""),
                phone: String(addr.phone || ""),
                company: "",
                country_code: resolveCountryCode(String(addr.country || "")),
              });
              setShowAdd(false);
            }}
            countries={countries}
            states={states}
            defaultCountry={defaultCountry}
            defaultState={defaultState}
          />
        </>
      )}
    </div>
  );
}
