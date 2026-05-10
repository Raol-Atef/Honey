'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { categoriesApi } from '@/lib/api/categories';
import { getImageUrl } from '@/lib/api/axios';
import type { Product, Category } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  discountPrice: z.number().min(0, 'Discount price must be positive'),
  stockQuantity: z.number().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  weightValue: z.number().min(0, 'Weight must be positive'),
  weightUnit: z.string().min(1, 'Weight unit is required'),
  origin: z.string().min(1, 'Origin is required'),
  honeyType: z.string().min(1, 'Honey type is required'),
  flavorProfile: z.string().optional(),
  ingredients: z.string().optional(),
  tags: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ product, open, onClose, onSubmit, isSubmitting }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      category: '',
      weightValue: 0,
      weightUnit: 'g',
      origin: '',
      honeyType: '',
      flavorProfile: '',
      ingredients: '',
      tags: '',
      isFeatured: false,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll(true);
        if (response.data?.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        stockQuantity: product.stockQuantity,
        category: product.category?._id || '',
        weightValue: product.weight?.value || 0,
        weightUnit: product.weight?.unit || 'g',
        origin: product.origin || '',
        honeyType: product.honeyType || '',
        flavorProfile: product.flavorProfile || '',
        ingredients: product.ingredients?.join(', ') || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true,
      });
      setImagePreview(getImageUrl(product.image));
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        discountPrice: 0,
        stockQuantity: 0,
        category: '',
        weightValue: 0,
        weightUnit: 'g',
        origin: '',
        honeyType: '',
        flavorProfile: '',
        ingredients: '',
        tags: '',
        isFeatured: false,
        isActive: true,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, form, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(product ? getImageUrl(product.image) : null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('discountPrice', String(data.discountPrice));
    formData.append('stockQuantity', String(data.stockQuantity));
    formData.append('category', data.category);
    formData.append('weight[value]', String(data.weightValue));
    formData.append('weight[unit]', data.weightUnit);
    formData.append('origin', data.origin);
    formData.append('honeyType', data.honeyType);
    formData.append('flavorProfile', data.flavorProfile || '');
    formData.append('ingredients', data.ingredients || '');
    formData.append('tags', data.tags || '');
    formData.append('isFeatured', String(data.isFeatured));
    formData.append('isActive', String(data.isActive));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel>Product Image</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative h-32 w-32">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="mt-2 text-sm text-muted-foreground">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product description" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weightValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weightUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="ml">Milliliters (ml)</SelectItem>
                        <SelectItem value="L">Liters (L)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="Country of origin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="honeyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Honey Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Raw, Organic, Manuka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flavorProfile"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Flavor Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Floral, smooth, medium sweetness" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Ingredients (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., honey, bee pollen" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., organic, raw, premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Featured Product</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    {product ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{product ? 'Update Product' : 'Create Product'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
