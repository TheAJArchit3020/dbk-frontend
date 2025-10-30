import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-text flex flex-col items-center text-bg-light">
      <div className="bg-text w-full p-20 flex-row flex justify-around">
        <div className=" flex flex-col gap-5 w-[30%]">
          <h1 className="text-h2 font-bold">Get in touch</h1>
          <p>
            Shaam clothing pvt ltdG7, Badhe warehouse, Gate number 2, Opp
            Angaraj Dabba, Kondhwa Budruk, Pune
            411048.help@shauryasanadhya.com+91-9168076000Timing (Mon to Sat
            10:30 AM to 6:30Pm)
          </p>
        </div>
        <div className="text-bg-light flex flex-col gap-5">
          <h1 className="text-h2 font-bold">Discover</h1>
          <div className="flex flex-col gap-2">
            <Link href={"/blog"}>About Us</Link>
            <Link href={"/blog"}>Blogs</Link>
          </div>
        </div>
        <div className="text-bg-light flex flex-col gap-5">
          <h1 className="text-h2 font-bold">Customer Policies</h1>
          <div className="flex flex-col gap-2">
            <Link href={"/blog"}>Exchange and return policy</Link>
            <Link href={"/blog"}>Privacy Policy</Link>
            <Link href={"/blog"}>Terms of Use</Link>
          </div>
        </div>
        <div className="text-bg-light flex flex-col gap-5">
          <h1 className="text-h2 font-bold">Socials</h1>
          <div className="flex flex-col gap-2">
            <Link className="flex flex-row gap-2" href={"/blog"}>
              <Image
                src={"/SVGs/InstaIcon.svg"}
                width={20}
                height={20}
                alt="instagram"
              />{" "}
              Instagram
            </Link>
            <Link className="flex flex-row gap-2" href={"/blog"}>
              {" "}
              <Image
                src={"/SVGs/facebookIcon.svg"}
                width={20}
                height={20}
                alt="facebook"
              />
              Facebook
            </Link>
          </div>
        </div>
      </div>
      <div>
        <h2>copyright © 2025 dhagabykomal </h2>
      </div>
    </div>
  );
}
