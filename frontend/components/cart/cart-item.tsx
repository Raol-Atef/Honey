'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem as CartItemType } from '@/lib/types';
import { getImageUrl } from '@/lib/api/axios';
import { useCartStore } from '@/lib/stores/cart-store';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCartStore();

  const handleQuantityChange = async (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    
    const result = await updateQuantity(item._id, newQuantity);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleRemove = async () => {
    const result = await removeItem(item._id);
    if (result.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.message);
    }
  };

  const hasDiscount = item.product.discountPrice > 0 && item.product.discountPrice < item.product.price;
  const unitPrice = hasDiscount ? item.product.discountPrice : item.product.price;
  const totalPrice = item.priceAtTime * item.quantity;

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4">
      {/* Product Image */}
      <Link href={`/products/${item.product._id}`} className="shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-md bg-secondary sm:h-32 sm:w-32">
          <Image
            src={getImageUrl(item.product.image)}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link href={`/products/${item.product._id}`}>
              <h3 className="font-medium text-foreground hover:text-primary">
                {item.product.name}
              </h3>
            </Link>
            {item.product.weight && (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.product.weight.value}{item.product.weight.unit}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleRemove}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
              disabled={isLoading || item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
              disabled={isLoading || item.quantity >= item.product.stockQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">
              ${totalPrice.toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-sm text-muted-foreground">
                ${unitPrice.toFixed(2)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
