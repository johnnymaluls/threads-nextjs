"use client";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const LeftSidebarLinks = () => {
  const pathname = usePathname(); //to get the current url
  return (
    <>
      {sidebarLinks.map((link) => {
        //To check if the link is currently active
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;
        return (
          <Link
            href={link.route}
            key={link.label}
            className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${
              isActive && "bg-primary-500"
            }`}
          >
            <Image src={link.imgURL} alt="link-image" width={24} height={24} />
            <p className="text-subtle-medium text-light-1 max-sm:hidden">
              {link.label.split(/\s+/)[0]}
            </p>
          </Link>
        );
      })}
    </>
  );
};

const Bottombar = () => {
  return (
    <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 md:hidden">
      <div className="flex items-center justify-between gap-3 xs:gap-5">
        <LeftSidebarLinks />
      </div>
    </section>
  );
};

export default Bottombar;
