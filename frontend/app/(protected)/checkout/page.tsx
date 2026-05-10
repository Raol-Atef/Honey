'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CreditCard, Wallet, Banknote, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ordersApi } from '@/lib/api/orders';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  paymentMethod: z.enum(['cash_on_delivery', 'card', 'wallet']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart, resetCart } = useCartStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      country: user?.address?.country || '',
      postalCode: user?.address?.postalCode || '',
      phone: user?.phone || '',
      paymentMethod: 'cash_on_delivery',
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ordersApi.create({
        shippingAddress: {
          street: data.street,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
      });

      if (response.success && response.data?.order) {
        resetCart();
        toast.success('Order placed successfully!');
        router.push(`/my-orders/${response.data.order._id}`);
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = !cart?.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardContent className="py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Add some products to your cart before checking out.
            </p>
            <Link href="/products">
              <Button className="mt-6">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate order summary
  const itemsPrice = cart?.totalPrice || 0;
  const shippingPrice = 50; // Fixed shipping
  const taxPrice = itemsPrice * 0.14; // 14% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Shipping & Payment Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-3 rounded-lg border border-border p-4">
                              <RadioGroupItem value="cash_on_delivery" id="cash" />
                              <label htmlFor="cash" className="flex flex-1 cursor-pointer items-center gap-3">
                                <Banknote className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Cash on Delivery</p>
                                  <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border border-border p-4">
                              <RadioGroupItem value="card" id="card" />
                              <label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-3">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Credit/Debit Card</p>
                                  <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border border-border p-4">
                              <RadioGroupItem value="wallet" id="wallet" />
                              <label htmlFor="wallet" className="flex flex-1 cursor-pointer items-center gap-3">
                                <Wallet className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Digital Wallet</p>
                                  <p className="text-sm text-muted-foreground">Pay with your e-wallet balance</p>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-2">
                    {cart?.items.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>${(item.priceAtTime * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (14%)</span>
                    <span>${taxPrice.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
