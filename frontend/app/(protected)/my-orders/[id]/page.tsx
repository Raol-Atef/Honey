'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, CreditCard, XCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import { ordersApi } from '@/lib/api/orders';
import { getImageUrl } from '@/lib/api/axios';
import type { Order } from '@/lib/types';
import { toast } from 'sonner';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersApi.getMyOrder(params.id as string);
        if (response.success && response.data?.order) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error('Order not found');
        router.push('/my-orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  const handleCancelOrder = async () => {
    if (!order) return;

    setIsCancelling(true);
    try {
      const response = await ordersApi.cancelMyOrder(order._id);
      if (response.success && response.data?.order) {
        setOrder({ ...order, orderStatus: 'cancelled' });
        toast.success('Order cancelled successfully');
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = order?.orderStatus === 'pending' || order?.orderStatus === 'confirmed';

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link href="/my-orders" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image
                      src={getImageUrl(item.image || item.product?.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium text-foreground">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary p-4">
                <p className="font-medium">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                <p className="mt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {order.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              {order.paidAt && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Cancel Order */}
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2" disabled={isCancelling}>
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Cancel Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
