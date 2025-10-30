"use client";

import type { HttpTypes } from "@medusajs/types";
import Image from "next/image";

type Props = {
  product: HttpTypes.StoreProduct;
  selectedOptions: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
};

export default function VariantSelector({
  product,
  selectedOptions,
  onChange,
}: Props) {
  const toggle = (optionId: string, value: string) => {
    onChange({ ...selectedOptions, [optionId]: value });
  };

  if (!product.options?.length) return null;

  return (
    <div className="space-y-4 bg-bg-dark p-3 rounded-md">
      {product.options.map((opt) => (
        <div key={opt.id}>
          <div className="flex flex-row justify-between">
            <div className="text-sm text-text-mutable mb-2 font-bold text-normal">
              Choose Size
            </div>

            <div className="text-sm text-text-mutable mb-2 font-bold text-normal underline flex gap-2 items-center">
              <Image
                src="/SVGs/descending-number-order.svg"
                height={20}
                width={20}
                alt="svg"
              />
              <span>Size Chart</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {opt.values?.map((v) => {
              const active = selectedOptions[opt.id!] === v.value;
              return (
                <button
                  key={v.id}
                  onClick={() => toggle(opt.id!, v.value!)}
                  className={`rounded-full border px-4 py-2 text-sm transition
                    ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-bg text-text hover:bg-bg-dark/60"
                    }`}
                >
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
