'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/orders/order-status-badge';
import { ordersApi } from '@/lib/api/orders';
import type { Order, OrderFilters, OrderStatus, PaymentStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
  });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ordersApi.getAllOrders(filters);
      if (response.data?.orders) {
        setOrders(response.data.orders);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusFilter = (value: string) => {
    setFilters({
      ...filters,
      orderStatus: value === 'all' ? undefined : (value as OrderStatus),
      page: 1,
    });
  };

  const handlePaymentFilter = (value: string) => {
    setFilters({
      ...filters,
      paymentStatus: value === 'all' ? undefined : (value as PaymentStatus),
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-muted-foreground">{pagination.totalOrders} orders total</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={filters.orderStatus || 'all'} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.paymentStatus || 'all'} onValueChange={handlePaymentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const user = typeof order.user === 'object' ? order.user : null;
              return (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {user ? (
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="font-medium">${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                  className={pagination.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const current = pagination.page;
                  return page === 1 || page === pagination.totalPages || 
                         (page >= current - 1 && page <= current + 1);
                })
                .map((page, idx, arr) => (
                  <PaginationItem key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === pagination.page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.page < pagination.totalPages && handlePageChange(pagination.page + 1)}
                  className={pagination.page >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
