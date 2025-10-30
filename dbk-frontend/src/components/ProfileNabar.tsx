import Image from "next/image";
import Link from "next/link";

export default function ProfileNavbar() {
  return (
    <header className="sticky top-0 z-40 border-text border-b bg-bg-light w-full">
      <div className="flex h-30 items-center gap-4 px-4 sm:px-8 justify-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/dbk_logo.png"
            alt="Dhaga by Komal"
            width={160}
            height={40}
            className="h-30 w-auto"
            priority
          />
          <span className="sr-only">Dhaga by Komal</span>
        </Link>
      </div>
    </header>
  );
}
