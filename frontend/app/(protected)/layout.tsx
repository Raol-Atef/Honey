import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProtectedRoute } from '@/components/layout/protected-route';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
