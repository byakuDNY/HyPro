export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="pb-4 pt-16">{children}</section>
    </main>
  );
}
