// User types
export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt?: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface Weight {
  value: number;
  unit: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  category: Category;
  seller?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  image: string;
  images?: string[];
  weight: Weight;
  origin: string;
  honeyType: string;
  flavorProfile: string;
  ingredients: string[];
  tags: string[];
  ratingAverage: number;
  ratingCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Cart types
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Order types
export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    discountPrice: number;
    stockQuantity?: number;
  };
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash_on_delivery' | 'card' | 'wallet';

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalProducts?: number;
    totalOrders?: number;
    totalPages: number;
  };
  data: T;
}

// Auth response types
export interface AuthResponse {
  user: User;
  token: string;
}

// Filter types
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  honeyType?: string;
  origin?: string;
  isFeatured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface OrderFilters {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  user?: string;
  page?: number;
  limit?: number;
}
