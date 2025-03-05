import Link from "next/link";
import { usePathname } from "next/navigation";



import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";





interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({ isOpen, setIsOpen }: MobileMenuProps) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-16 z-40 overflow-y-auto bg-background sm:hidden">
      <div className="space-y-1 pb-3 pt-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`transition: all 0.2s ease-in-out; block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
              pathname === item.href
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:border-secondary-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="border-t border-border pb-3 pt-4">
        <div className="flex items-center space-x-4 px-4">
          <ModeToggle />
          <Button asChild className="w-full">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
