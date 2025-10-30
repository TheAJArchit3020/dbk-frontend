"use client";
import { InformationCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

export type Address = {
  id: string | number;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  country: string;
};

type Props = {
  addresses: Address[];
  onAdd: () => void;
};

export default function AddressList({ addresses, onAdd }: Props) {
  return (
    <section className="rounded-xl bg-[#F3EFEC] p-4 md:p-5 border border-gray-200">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Addresses</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm border border-gray-300 hover:bg-black/5"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-gray-600 text-sm gap-2">
          <InformationCircleIcon className="h-5 w-5" />
          No addresses added
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-gray-200 p-3 bg-white"
            >
              <p className="font-medium">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-sm text-gray-700">
                {a.address1}
                {a.address2 ? `, ${a.address2}` : ""}, {a.city}, {a.state},{" "}
                {a.pinCode}
              </p>
              <p className="text-sm text-gray-500">
                {a.country} • {a.phone}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
