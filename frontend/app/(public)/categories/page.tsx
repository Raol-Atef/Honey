'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { categoriesApi } from '@/lib/api/categories';
import { getImageUrl } from '@/lib/api/axios';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        if (response.data?.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Shop by Category</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Explore our diverse collection of premium honey products, organized by category to help you find exactly what you are looking for.
        </p>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category._id} href={`/products?category=${category._id}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="mb-4 line-clamp-2 text-muted-foreground">
                    {category.description}
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    Browse Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">No categories available.</p>
          <Link href="/products">
            <Button variant="outline" className="mt-4">
              View All Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
