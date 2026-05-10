import { ProtectedRoute } from '@/components/layout/protected-route';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Navbar } from '@/components/layout/navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
