'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/lib/types';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersApi.getMyOrders();
        if (response.data?.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        <p className="mt-2 text-muted-foreground">View and track your order history</p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No orders yet</h2>
            <p className="mt-2 text-muted-foreground">
              When you place an order, it will appear here.
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
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} href={`/my-orders/${order._id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <OrderStatusBadge status={order.orderStatus} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                      <Button variant="ghost" size="sm" className="gap-1 text-primary">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
