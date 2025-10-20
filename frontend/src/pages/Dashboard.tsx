import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateShort } from '../utils/formatDate';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await dashboardService.getDashboard();
      setData(result);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#171717', '#404040', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5'];

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <Skeleton className="h-8 w-32" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-500">
                  Income
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-neutral-400" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-neutral-900">
                {formatCurrency(data?.summary.total_income || 0)}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                {data?.summary.total_transactions || 0} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-500">
                  Expense
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-neutral-400" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-neutral-900">
                {formatCurrency(data?.summary.total_expense || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-500">
                  Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-neutral-400" strokeWidth={1.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-semibold ${(data?.summary.balance || 0) >= 0 ? 'text-neutral-900' : 'text-red-600'}`}>
                {formatCurrency(data?.summary.balance || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Trend Chart */}
          <Card className="border-neutral-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-neutral-900">Monthly Trend</CardTitle>
              <CardDescription className="text-neutral-500">Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.monthly_trend.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-sm text-neutral-400">No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data?.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="#a3a3a3" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#a3a3a3" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e5e5', 
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#171717" 
                      strokeWidth={2} 
                      name="Income"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#a3a3a3" 
                      strokeWidth={2} 
                      name="Expense"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown Pie Chart */}
          <Card className="border-neutral-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-neutral-900">Spending by Category</CardTitle>
              <CardDescription className="text-neutral-500">Top 6 categories</CardDescription>
            </CardHeader>
            <CardContent>
              {data?.category_breakdown.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-sm text-neutral-400">No data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={(data?.category_breakdown.slice(0, 6) as unknown) as any}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => entry.name}
                      outerRadius={100}
                      fill="#171717"
                      dataKey="total_amount"
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {data?.category_breakdown.slice(0, 6).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e5e5', 
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-neutral-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-neutral-900">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recent_transactions.length === 0 ? (
              <p className="text-center text-neutral-400 py-12 text-sm">No transactions yet</p>
            ) : (
              <div className="space-y-px">
                {data?.recent_transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: transaction.category_color || '#e5e5e5' }}
                      >
                        {transaction.category_icon || '📝'}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">
                          {transaction.category_name || 'Uncategorized'}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {transaction.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {formatDateShort(transaction.transaction_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}