import api from './axios';
import type { ApiResponse, PaginatedResponse, Product, ProductFilters } from '../types';

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<{ products: Product[] }>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
