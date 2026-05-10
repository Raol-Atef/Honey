'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductForm } from '@/components/products/product-form';
import { productsApi } from '@/lib/api/products';
import { getImageUrl } from '@/lib/api/axios';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll({ includeInactive: true, limit: 100 });
      if (response.data?.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const response = await productsApi.update(editingProduct._id, formData);
        if (response.success) {
          toast.success('Product updated successfully');
          fetchProducts();
          setIsFormOpen(false);
        } else {
          toast.error(response.message || 'Failed to update product');
        }
      } else {
        const response = await productsApi.create(formData);
        if (response.success) {
          toast.success('Product created successfully');
          fetchProducts();
          setIsFormOpen(false);
        } else {
          toast.error(response.message || 'Failed to create product');
        }
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const response = await productsApi.delete(deletingProduct._id);
      if (response.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(response.message || 'Failed to delete product');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingProduct(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-muted-foreground">{products.length} products total</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-secondary">
                      <Image
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.weight?.value}{product.weight?.unit}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category?.name || 'N/A'}</TableCell>
                <TableCell>
                  <div>
                    ${product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                    {product.discountPrice > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={product.stockQuantity === 0 ? 'text-destructive' : ''}>
                    {product.stockQuantity}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No products found. Create your first product!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Product Form Dialog */}
      <ProductForm
        product={editingProduct}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingProduct?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
