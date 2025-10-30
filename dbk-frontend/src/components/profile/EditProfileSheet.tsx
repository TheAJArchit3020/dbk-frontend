"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (v: { firstName: string; lastName: string }) => void;
  firstName: string;
  lastName: string;
  email: string; // read-only
};

export default function EditProfileSheet({
  open,
  onClose,
  onSave,
  firstName,
  lastName,
  email,
}: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div
        className="
          w-full sm:max-w-lg bg-[#F3EFEC] border border-gray-200
          rounded-t-2xl sm:rounded-2xl p-5 sm:p-6
          shadow-xl
        "
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1 rounded hover:bg-black/5"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">First name</label>
            <input
              name="firstName"
              defaultValue={firstName}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Last name</label>
            <input
              name="lastName"
              defaultValue={lastName}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <p className="text-xs text-gray-500 pt-1">Email can’t be edited</p>

          <div className="mt-3 flex items-center justify-end gap-3">
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
