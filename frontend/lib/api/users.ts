import api from './axios';
import type { ApiResponse, User } from '../types';

export const usersApi = {
  getAll: async (): Promise<ApiResponse<{ users: User[] }> & { count: number }> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  },
};
