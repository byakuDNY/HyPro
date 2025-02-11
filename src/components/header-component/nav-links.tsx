"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/lib/constants";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`transition: all 0.2s ease-in-out; inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
            pathname === item.href
              ? "border-primary text-foreground"
              : "text-muted-foreground hover:border-secondary-foreground hover:text-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
