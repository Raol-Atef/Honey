'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCartStore } from '@/lib/stores/cart-store';

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { cart } = useCartStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const cartItemCount = cart?.totalItems || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-primary-foreground">H</span>
          </div>
          <span className="text-xl font-bold text-foreground">Honey Store</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            Products
          </Link>
          <Link href="/categories" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            Categories
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-orders" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>

            {isAuthenticated ? (
              <>
                <div className="my-2 border-t border-border" />
                <Link
                  href="/cart"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/my-orders"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-secondary"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-border" />
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
