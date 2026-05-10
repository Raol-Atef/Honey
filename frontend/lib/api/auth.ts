import api from './axios';
import type { ApiResponse, AuthResponse, User } from '../types';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  signup: async (data: SignupData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
