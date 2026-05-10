import { Badge } from '@/components/ui/badge';
import type { OrderStatus, PaymentStatus } from '@/lib/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<OrderStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'secondary', label: 'Pending' },
    confirmed: { variant: 'outline', label: 'Confirmed' },
    processing: { variant: 'default', label: 'Processing' },
    shipped: { variant: 'default', label: 'Shipped' },
    delivered: { variant: 'default', label: 'Delivered' },
    cancelled: { variant: 'destructive', label: 'Cancelled' },
  };

  const config = variants[status] || { variant: 'secondary' as const, label: status };

  return (
    <Badge 
      variant={config.variant}
      className={
        status === 'delivered' 
          ? 'bg-green-600 text-white hover:bg-green-700' 
          : status === 'shipped'
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : status === 'processing'
          ? 'bg-amber-600 text-white hover:bg-amber-700'
          : ''
      }
    >
      {config.label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const variants: Record<PaymentStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'secondary', label: 'Pending' },
    paid: { variant: 'default', label: 'Paid' },
    failed: { variant: 'destructive', label: 'Failed' },
    refunded: { variant: 'outline', label: 'Refunded' },
  };

  const config = variants[status] || { variant: 'secondary' as const, label: status };

  return (
    <Badge 
      variant={config.variant}
      className={status === 'paid' ? 'bg-green-600 text-white hover:bg-green-700' : ''}
    >
      {config.label}
    </Badge>
  );
}
