export default function ChurchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 