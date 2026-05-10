'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getImageUrl } from '@/lib/api/axios';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success('Added to cart');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
            {product.category?.name || 'Uncategorized'}
          </p>

          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-balance text-lg font-semibold text-foreground">
            {product.name}
          </h3>

          {/* Details */}
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {product.weight && (
              <span>{product.weight.value}{product.weight.unit}</span>
            )}
            {product.origin && (
              <>
                <span>|</span>
                <span>{product.origin}</span>
              </>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            disabled={isOutOfStock || isLoading}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
