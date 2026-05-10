'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Minus, Plus, Star, Truck, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { productsApi } from '@/lib/api/products';
import { getImageUrl } from '@/lib/api/axios';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading: isAddingToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsApi.getById(params.id as string);
        if (response.success && response.data?.product) {
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product) return;

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success(`Added ${quantity} item(s) to cart`);
    } else {
      toast.error(result.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
          <Image
            src={getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
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

        {/* Product Info */}
        <div>
          {/* Category */}
          <Link 
            href={`/products?category=${product.category?._id}`}
            className="text-sm font-medium uppercase tracking-wider text-primary hover:underline"
          >
            {product.category?.name || 'Uncategorized'}
          </Link>

          {/* Name */}
          <h1 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {/* Rating */}
          {product.ratingCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.ratingAverage)
                        ? 'fill-primary text-primary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.ratingCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-pretty text-muted-foreground">
            {product.description}
          </p>

          <Separator className="my-6" />

          {/* Product Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            {product.weight && (
              <div>
                <span className="text-sm font-medium text-foreground">Weight</span>
                <p className="text-muted-foreground">{product.weight.value}{product.weight.unit}</p>
              </div>
            )}
            {product.origin && (
              <div>
                <span className="text-sm font-medium text-foreground">Origin</span>
                <p className="text-muted-foreground">{product.origin}</p>
              </div>
            )}
            {product.honeyType && (
              <div>
                <span className="text-sm font-medium text-foreground">Honey Type</span>
                <p className="text-muted-foreground">{product.honeyType}</p>
              </div>
            )}
            {product.flavorProfile && (
              <div>
                <span className="text-sm font-medium text-foreground">Flavor Profile</span>
                <p className="text-muted-foreground">{product.flavorProfile}</p>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-foreground">Ingredients</span>
              <p className="text-muted-foreground">{product.ingredients.join(', ')}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          {/* Stock Status */}
          <div className="mb-4">
            <span className="text-sm font-medium text-foreground">Availability: </span>
            {isOutOfStock ? (
              <span className="text-destructive">Out of Stock</span>
            ) : (
              <span className="text-green-600">{product.stockQuantity} in stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stockQuantity || isOutOfStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full gap-2 sm:w-auto"
            disabled={isOutOfStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {/* Features */}
          <div className="mt-8 grid gap-4 rounded-lg bg-secondary p-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-sm">100% Organic</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
