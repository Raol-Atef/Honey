'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category, ProductFilters as Filters } from '@/lib/types';

interface ProductFiltersProps {
  filters: Filters;
  categories: Category[];
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  const hasActiveFilters = 
    filters.search || 
    filters.category || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.honeyType || 
    filters.origin ||
    filters.sort;

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value, 
      page: 1 
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      sort: value === 'default' ? undefined : value as Filters['sort'], 
      page: 1 
    });
  };

  const handleMinPriceChange = (value: string) => {
    const num = value ? Number(value) : undefined;
    onFilterChange({ ...filters, minPrice: num, page: 1 });
  };

  const handleMaxPriceChange = (value: string) => {
    const num = value ? Number(value) : undefined;
    onFilterChange({ ...filters, maxPrice: num, page: 1 });
  };

  const handleHoneyTypeChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      honeyType: value === 'all' ? undefined : value, 
      page: 1 
    });
  };

  const handleOriginChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      origin: value === 'all' ? undefined : value, 
      page: 1 
    });
  };

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Products</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minPrice || ''}
            onChange={(e) => handleMinPriceChange(e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxPrice || ''}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
          />
        </div>
      </div>

      {/* Honey Type */}
      <div className="space-y-2">
        <Label>Honey Type</Label>
        <Select
          value={filters.honeyType || 'all'}
          onValueChange={handleHoneyTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="raw">Raw Honey</SelectItem>
            <SelectItem value="organic">Organic Honey</SelectItem>
            <SelectItem value="manuka">Manuka Honey</SelectItem>
            <SelectItem value="wildflower">Wildflower Honey</SelectItem>
            <SelectItem value="clover">Clover Honey</SelectItem>
            <SelectItem value="mountain">Mountain Honey</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Origin */}
      <div className="space-y-2">
        <Label>Origin</Label>
        <Select
          value={filters.origin || 'all'}
          onValueChange={handleOriginChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Origins" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Origins</SelectItem>
            <SelectItem value="egypt">Egypt</SelectItem>
            <SelectItem value="new zealand">New Zealand</SelectItem>
            <SelectItem value="usa">USA</SelectItem>
            <SelectItem value="australia">Australia</SelectItem>
            <SelectItem value="greece">Greece</SelectItem>
            <SelectItem value="yemen">Yemen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sort || 'default'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
