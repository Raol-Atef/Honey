'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { CartItem } from '@/components/cart/cart-item';
import { useCartStore } from '@/lib/stores/cart-store';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, isLoading, fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success('Cart cleared');
    } else {
      toast.error(result.message);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="mt-2 text-muted-foreground">
            {isEmpty ? 'Your cart is empty' : `${cart?.totalItems} item(s) in your cart`}
          </p>
        </div>
        {!isEmpty && (
          <Button variant="outline" size="sm" onClick={handleClearCart} disabled={isLoading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        )}
      </div>

      {isEmpty ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Looks like you have not added anything to your cart yet.
            </p>
            <Link href="/products">
              <Button className="mt-6 gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart?.items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cart?.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-sm text-muted-foreground">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Estimated Total</span>
                  <span>${cart?.totalPrice.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full gap-2" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
