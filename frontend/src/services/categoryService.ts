import api from './api';
import type { Category, ApiResponse } from '../types';

export const categoryService = {
  async getAll(type?: 'income' | 'expense'): Promise<Category[]> {
    const params = type ? `?type=${type}` : '';
    const response = await api.get<ApiResponse<Category[]>>(`/categories${params}`);
    return response.data.data!;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data!;
  },

  async create(data: Partial<Category>): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data.data!;
  },

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async getStats() {
    const response = await api.get('/categories/stats');
    return response.data.data;
  },
};