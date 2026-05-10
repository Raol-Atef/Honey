import api from './axios';
import type { ApiResponse, Category } from '../types';

interface CategoriesResponse {
  categories: Category[];
}

export const categoriesApi = {
  getAll: async (includeInactive = false): Promise<ApiResponse<CategoriesResponse> & { count: number }> => {
    const params = includeInactive ? '?includeInactive=true' : '';
    const response = await api.get(`/categories${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ category: Category }>> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<ApiResponse<{ category: Category }>> => {
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse<{ category: Category }>> => {
    const response = await api.patch(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
