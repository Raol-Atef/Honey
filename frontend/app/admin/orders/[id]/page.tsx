'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, CreditCard, Package, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import { ordersApi } from '@/lib/api/orders';
import { getImageUrl } from '@/lib/api/axios';
import type { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersApi.getOrderById(params.id as string);
        if (response.success && response.data?.order) {
          setOrder(response.data.order);
          setOrderStatus(response.data.order.orderStatus);
          setPaymentStatus(response.data.order.paymentStatus);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error('Order not found');
        router.push('/admin/orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  const handleSaveStatus = async () => {
    if (!order) return;

    setIsSaving(true);
    try {
      const response = await ordersApi.updateOrderStatus(order._id, {
        orderStatus,
        paymentStatus,
      });

      if (response.success && response.data?.order) {
        setOrder({
          ...order,
          orderStatus: response.data.order.orderStatus || orderStatus,
          paymentStatus: response.data.order.paymentStatus || paymentStatus,
          paidAt: response.data.order.paidAt,
          deliveredAt: response.data.order.deliveredAt,
        });
        toast.success('Order status updated successfully');
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

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

  const user = typeof order.user === 'object' ? order.user : null;

  return (
    <div>
      {/* Back Button */}
      <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
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
        <div className="lg:col-span-2 space-y-6">
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

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Status</label>
                  <Select value={orderStatus} onValueChange={(v) => setOrderStatus(v as OrderStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveStatus} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Spinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
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

          {/* Customer Info */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                )}
              </CardContent>
            </Card>
          )}

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
              {order.deliveredAt && (
                <p className="text-sm text-muted-foreground">
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
