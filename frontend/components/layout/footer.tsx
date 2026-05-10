import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-primary-foreground">H</span>
              </div>
              <span className="text-xl font-bold text-foreground">Honey Store</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Discover the finest selection of premium, organic honey sourced directly from trusted beekeepers. 
              Pure, natural sweetness delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Account</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {currentYear} Honey Store. All rights reserved. Made with love for honey enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
