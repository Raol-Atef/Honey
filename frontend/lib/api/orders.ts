import api from './axios';
import type { ApiResponse, Order, OrderFilters, OrderStatus, PaymentMethod, PaymentStatus, PaginatedResponse, ShippingAddress } from '../types';

interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

interface UpdateOrderStatusData {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export const ordersApi = {
  // User endpoints
  create: async (data: CreateOrderData): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<ApiResponse<{ orders: Order[] }> & { count: number }> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getMyOrder: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/orders/my-orders/${id}`);
    return response.data;
  },

  cancelMyOrder: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.patch(`/orders/my-orders/${id}/cancel`);
    return response.data;
  },

  // Admin endpoints
  getAllOrders: async (filters?: OrderFilters): Promise<PaginatedResponse<{ orders: Order[] }>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/orders/admin/all?${params.toString()}`);
    return response.data;
  },

  getOrderById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/orders/admin/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, data: UpdateOrderStatusData): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.patch(`/orders/admin/${id}/status`, data);
    return response.data;
  },
};
