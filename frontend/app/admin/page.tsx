'use client';

import Link from 'next/link';
import { Package, FolderOpen, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const adminLinks = [
  {
    title: 'Products',
    description: 'Manage your product catalog, add new products, and update inventory.',
    icon: Package,
    href: '/admin/products',
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    title: 'Categories',
    description: 'Organize products into categories for better navigation.',
    icon: FolderOpen,
    href: '/admin/categories',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Orders',
    description: 'View and manage customer orders, update order status.',
    icon: ShoppingCart,
    href: '/admin/orders',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Users',
    description: 'Manage customer accounts and user permissions.',
    icon: Users,
    href: '/admin/users',
    color: 'bg-purple-500/10 text-purple-600',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the Honey Store admin panel. Manage your store from here.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.href} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${link.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={link.href}>
                  <Button variant="outline" className="w-full">
                    Manage {link.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
