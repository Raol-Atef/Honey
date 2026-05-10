'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { Spinner } from '@/components/ui/spinner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import type { Product, Category, ProductFilters as Filters } from '@/lib/types';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 1,
  });

  // Get filters from URL params
  const getFiltersFromParams = useCallback((): Filters => {
    return {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      honeyType: searchParams.get('honeyType') || undefined,
      origin: searchParams.get('origin') || undefined,
      isFeatured: searchParams.get('isFeatured') === 'true' ? true : undefined,
      sort: (searchParams.get('sort') as Filters['sort']) || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: 12,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<Filters>(getFiltersFromParams());

  // Update URL when filters change
  const updateUrlParams = useCallback((newFilters: Filters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'limit') {
        params.set(key, String(value));
      }
    });
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsApi.getAll(filters);
        if (response.data?.products) {
          setProducts(response.data.products);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        if (response.data?.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Update filters from URL on mount and when URL changes
  useEffect(() => {
    setFilters(getFiltersFromParams());
  }, [searchParams, getFiltersFromParams]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: Filters = { page: 1, limit: 12 };
    setFilters(clearedFilters);
    router.push('/products');
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateUrlParams(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our complete collection of premium honey products
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <ProductFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <p className="text-sm text-muted-foreground">
              {pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''} found
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters
                    filters={filters}
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Results Count */}
          <div className="mb-4 hidden lg:block">
            <p className="text-sm text-muted-foreground">
              {pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
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
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-lg text-muted-foreground">No products found.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search criteria.
              </p>
              <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
