'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-sidebar-border p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== '/admin' && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-sidebar-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </div>
    </aside>
  );
}
