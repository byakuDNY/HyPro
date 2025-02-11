import Logo from "@/components/header-component/logo";
import ModeToggle from "@/components/mode-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col space-y-4">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <ModeToggle />
        </div>
      </header>

      <section className="pb-4 pt-16">{children}</section>
    </main>
  );
}
