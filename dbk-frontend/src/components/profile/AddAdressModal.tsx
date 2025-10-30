"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (addr: any) => void;
  countries: string[];
  states: string[];
  defaultCountry?: string;
  defaultState?: string;
};

export default function AddAddressModal({
  open,
  onClose,
  onSave,
  countries,
  states,
  defaultCountry = countries[0],
  defaultState = states[0],
}: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave(Object.fromEntries(fd.entries()));
  };

  const inputCls =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[min(92vw,560px)] bg-[#F3EFEC] border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add address</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {/* Country */}
          <div>
            <label className="block text-sm text-gray-600">
              Country/region
            </label>
            <select
              name="country"
              defaultValue={defaultCountry}
              className={inputCls}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">First Name</label>
              <input name="firstName" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Last Name</label>
              <input name="lastName" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Address</label>
            <input name="address1" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              Apartment, suite, etc (optional)
            </label>
            <input name="address2" className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">City</label>
              <input name="city" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">State</label>
              <select
                name="state"
                defaultValue={defaultState}
                className={inputCls}
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Pin Code</label>
              <input name="pinCode" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input name="phone" defaultValue="+91" className={inputCls} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="text-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#C6423A] px-4 py-2 text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
