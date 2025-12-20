import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Categories API
export const categoriesApi = {
  getAll: async (locale: 'en' | 'ar' = 'en') => {
    const response = await api.get('/categories', {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getById: async (id: number, locale: 'en' | 'ar' = 'en') => {
    const response = await api.get(`/categories/${id}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getBySlug: async (slug: string, locale: 'en' | 'ar' = 'en') => {
    const response = await api.get(`/categories/slug/${slug}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },
};

// Products API
export const productsApi = {
  getAll: async (locale: 'en' | 'ar' = 'en', params?: any) => {
    const response = await api.get('/products', {
      headers: { 'Accept-Language': locale },
      params,
    });
    return response.data;
  },

  getById: async (id: number, locale: 'en' | 'ar' = 'en') => {
    const response = await api.get(`/products/${id}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getBySlug: async (slug: string, locale: 'en' | 'ar' = 'en') => {
    const response = await api.get(`/products/slug/${slug}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getRelated: async (slug: string, locale: 'en' | 'ar' = 'en') => {
    const response = await api.get(`/products/slug/${slug}/related`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },
};

// Cart API
export const cartApi = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId: number, quantity: number = 1) => {
    const response = await api.post('/cart/items', { product_id: productId, quantity });
    return response.data;
  },

  updateItem: async (itemId: number, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId: number) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },
};

// Wishlist API
export const wishlistApi = {
  get: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  toggle: async (productId: number) => {
    const response = await api.post('/wishlist/toggle', { product_id: productId });
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/register', { name, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};

// Banners API
export const bannersApi = {
  getAll: async (locale: 'en' | 'ar' = 'en', type?: string, position?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (position) params.append('position', position);

    const response = await api.get(`/banners?${params}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getByType: async (type: string, locale: 'en' | 'ar' = 'en', position?: string) => {
    const params = new URLSearchParams();
    if (position) params.append('position', position);

    const response = await api.get(`/banners/type/${type}?${params}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },
};

export default api;
