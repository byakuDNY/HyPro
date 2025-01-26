import Header from "@/features/marketing/components/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-16 text-foreground">
        {children}
      </div>
    </>
  );
}
