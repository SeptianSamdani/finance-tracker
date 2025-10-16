import api from './api';
import type { Budget, BudgetInput, ApiResponse } from '../types';

export const budgetService = {
  async getAll(period?: 'monthly' | 'yearly'): Promise<Budget[]> {
    const params = period ? `?period=${period}` : '';
    const response = await api.get<ApiResponse<Budget[]>>(`/budgets${params}`);
    return response.data.data!;
  },

  async getById(id: number): Promise<Budget> {
    const response = await api.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return response.data.data!;
  },

  async create(data: BudgetInput): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>('/budgets', data);
    return response.data.data!;
  },

  async update(id: number, data: Partial<BudgetInput>): Promise<Budget> {
    const response = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, data);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },

  async getSummary() {
    const response = await api.get('/budgets/summary');
    return response.data.data;
  },
};