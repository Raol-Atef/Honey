import api from './axios';
import type { ApiResponse, Cart } from '../types';

export const cartApi = {
  get: async (): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  updateItemQuantity: async (itemId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.patch(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId: string): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clear: async (): Promise<ApiResponse<{ cart: Cart }>> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
