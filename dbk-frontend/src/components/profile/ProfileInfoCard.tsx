"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Props = {
  name: string;
  email: string;
  onEdit: () => void;
};

export default function ProfileInfoCard({ name, email, onEdit }: Props) {
  return (
    <section className="rounded-xl bg-[#F3EFEC] p-4 md:p-5 border border-gray-200">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3 w-full">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{name}</p>
              <button
                type="button"
                onClick={onEdit}
                className="p-1 rounded-md hover:bg-black/5 text-gray-700"
                aria-label="Edit profile"
                title="Edit profile"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">{email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
