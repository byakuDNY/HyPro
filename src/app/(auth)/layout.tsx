// import { Logo } from "@/components/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
      {/* <Logo /> */}

      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold">Welcome to ProjectHub</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your projects with ease
        </p>
      </div>
      {children}
    </div>
  );
}
