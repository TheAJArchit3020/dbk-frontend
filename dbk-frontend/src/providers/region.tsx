"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "@/lib/sdk";

type RegionCtx = {
  region?: HttpTypes.StoreRegion;
  setRegion: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreRegion | undefined>
  >;
};
const RegionContext = createContext<RegionCtx | null>(null);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<HttpTypes.StoreRegion>();

  useEffect(() => {
    if (region) {
      localStorage.setItem("region_id", region.id);
      return;
    }
    const rid = localStorage.getItem("region_id");
    if (rid) {
      sdk.store.region.retrieve(rid).then(({ region }) => setRegion(region));
    } else {
      sdk.store.region.list().then(({ regions }) => setRegion(regions[0]));
    }
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}
export const useRegion = () => {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  return ctx;
};
