'use client';

import { create } from 'zustand';
import type { Cart, CartItem } from '../types';
import { cartApi } from '../api/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; message: string }>;
  removeItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => Promise<{ success: boolean; message: string }>;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.get();
      if (response.success && response.data?.cart) {
        set({ cart: response.data.cart, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch cart' });
      console.error('Failed to fetch cart:', error);
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.addItem(productId, quantity);
      if (response.success && response.data?.cart) {
        set({ cart: response.data.cart, isLoading: false });
        return { success: true, message: response.message };
      }
      set({ isLoading: false });
      return { success: false, message: response.message || 'Failed to add item' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const message = error instanceof Error ? error.message : 'Failed to add item to cart';
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { success: false, message: axiosError.response?.data?.message || message };
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.updateItemQuantity(itemId, quantity);
      if (response.success && response.data?.cart) {
        set({ cart: response.data.cart, isLoading: false });
        return { success: true, message: response.message };
      }
      set({ isLoading: false });
      return { success: false, message: response.message || 'Failed to update quantity' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const message = error instanceof Error ? error.message : 'Failed to update quantity';
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { success: false, message: axiosError.response?.data?.message || message };
    }
  },

  removeItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.removeItem(itemId);
      if (response.success && response.data?.cart) {
        set({ cart: response.data.cart, isLoading: false });
        return { success: true, message: response.message };
      }
      set({ isLoading: false });
      return { success: false, message: response.message || 'Failed to remove item' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const message = error instanceof Error ? error.message : 'Failed to remove item';
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { success: false, message: axiosError.response?.data?.message || message };
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartApi.clear();
      if (response.success && response.data?.cart) {
        set({ cart: response.data.cart, isLoading: false });
        return { success: true, message: response.message };
      }
      set({ isLoading: false });
      return { success: false, message: response.message || 'Failed to clear cart' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const message = error instanceof Error ? error.message : 'Failed to clear cart';
      const axiosError = error as { response?: { data?: { message?: string } } };
      return { success: false, message: axiosError.response?.data?.message || message };
    }
  },

  resetCart: () => {
    set({ cart: null, isLoading: false, error: null });
  },
}));
