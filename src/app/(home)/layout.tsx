import Header from "@/components/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-full pt-16 text-foreground">{children}</div>
    </>
  );
}
