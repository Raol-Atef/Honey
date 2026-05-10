'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/products/product-card';
import { Spinner } from '@/components/ui/spinner';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import { getImageUrl } from '@/lib/api/axios';
import type { Product, Category } from '@/lib/types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll({ isFeatured: true, limit: 4 }),
          categoriesApi.getAll(),
        ]);

        if (productsRes.data?.products) {
          setFeaturedProducts(productsRes.data.products);
        }
        if (categoriesRes.data?.categories) {
          setCategories(categoriesRes.data.categories.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Pure Natural <span className="text-primary">Honey</span> From Trusted Beekeepers
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                Discover our premium selection of organic honey, sourced directly from sustainable apiaries. 
                Experience the authentic taste of nature&apos;s golden nectar.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden aspect-square lg:block">
              <div className="absolute inset-0 rounded-full bg-primary/20" />
              <div className="absolute inset-8 rounded-full bg-primary/30" />
              <div className="absolute inset-16 flex items-center justify-center rounded-full bg-primary/40">
                <span className="text-8xl">🍯</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">100% Organic</h3>
                <p className="text-sm text-muted-foreground">Pure, natural honey without additives</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quality Guaranteed</h3>
                <p className="text-sm text-muted-foreground">Tested and certified products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">Our most popular honey selections</p>
            </div>
            <Link href="/products?isFeatured=true">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No featured products available.</p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Find the perfect honey for every occasion</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link key={category._id} href={`/products?category=${category._id}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No categories available.</p>
          )}

          <div className="mt-10 text-center">
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                View All Categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Taste the Difference?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of honey lovers who have discovered the pure taste of our premium honey. 
              Order today and get free shipping on your first order!
            </p>
            <div className="mt-8">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
