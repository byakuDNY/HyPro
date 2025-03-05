"use client";

import Link from "next/link";
import { useState } from "react";



import { LayoutDashboard, Menu, X } from "lucide-react";



import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";



import Logo from "./logo";
import MobileMenu from "./mobile-menu";
import NavLinks from "./nav-links";





const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <NavLinks />
        <div className="hidden space-x-4 sm:ml-6 sm:flex sm:items-center">
          <ModeToggle />
          <Button asChild>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </div>
        <div className="ml-2 flex items-center sm:hidden">
          <Button
            variant="link"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </header>
  );
};

export default Header;
