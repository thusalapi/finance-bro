"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { dashboard, transactions, budgets, goals } from '@/utils/apiClient';
import Button from '@/components/ui/Button';

interface DashboardData {
  totalExpenses: number;
  totalIncome: number;
  recentTransactions: any[];
  activeBudgets: any[];
  upcomingGoals: any[];
  cashflow: {
    monthly: number;
    yearly: number;
  };
  savingsRate: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      console.log("No user found, redirecting to login");
      router.push('/login');
      return;
    }

    // Load dashboard data if user is authenticated
    if (user) {
      console.log("User authenticated, loading dashboard data");
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching dashboard data...");
      
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      console.log("Token exists:", !!token);
      
      // Fetch dashboard summary data
      const dashboardSummary = await dashboard.getUserDashboard();
      console.log("Dashboard summary loaded:", dashboardSummary);
      
      // Fetch recent transactions
      const recentTransactions = await transactions.getAll();
      console.log("Recent transactions loaded:", recentTransactions.length);
      
      // Fetch active budgets
      const activeBudgets = await budgets.getAll();
      console.log("Active budgets loaded:", activeBudgets.length);
      
      // Fetch upcoming goals
      const upcomingGoals = await goals.getAll();
      console.log("Upcoming goals loaded:", upcomingGoals.length);
      
      // Combine all data
      setDashboardData({
        totalExpenses: dashboardSummary.totalExpenses || 0,
        totalIncome: dashboardSummary.totalIncome || 0,
        recentTransactions: recentTransactions.slice(0, 5) || [],
        activeBudgets: activeBudgets.slice(0, 3) || [],
        upcomingGoals: upcomingGoals.filter((goal: any) => !goal.completed).slice(0, 3) || [],
        cashflow: dashboardSummary.cashflow || { monthly: 0, yearly: 0 },
        savingsRate: dashboardSummary.savingsRate || 0
      });
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Dashboard data loading error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      setIsLoading(false);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return <div className="flex justify-center p-8">Checking authentication...</div>;
  }
  
  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return <div className="flex justify-center p-8">Redirecting to login...</div>;
  }
  
  // Show loading state while fetching dashboard data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-500">Loading your dashboard...</div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">Error</h1>
        <p className="text-red-700 mt-2">{error}</p>
        <Button onClick={loadDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold" data-testid="dashboard-title">
          Welcome, {user.name}!
        </h1>
        <Button 
          onClick={() => router.push('/transactions/new')}
          testId="new-transaction-button" 
        >
          New Transaction
        </Button>
      </div>
      
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Income</h2>
          <p className="text-3xl font-bold text-green-600" data-testid="income-amount">
            ${dashboardData?.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-600" data-testid="expense-amount">
            ${dashboardData?.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Net Cashflow</h2>
          <p 
            className={`text-3xl font-bold ${
              (dashboardData?.totalIncome || 0) - (dashboardData?.totalExpenses || 0) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`} 
            data-testid="cashflow-amount"
          >
            ${((dashboardData?.totalIncome || 0) - (dashboardData?.totalExpenses || 0)).toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => router.push('/transactions')}
            testId="view-all-transactions-button"
          >
            View All
          </Button>
        </div>
        
        {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.recentTransactions.map((transaction) => (
                  <tr 
                    key={transaction._id}
                    onClick={() => router.push(`/transactions/${transaction._id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span 
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                          ${transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td 
                      className={`px-4 py-3 text-right whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toFixed(2)} {transaction.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No recent transactions. Click "New Transaction" to add one.
          </p>
        )}
      </div>
      
      {/* Active Budgets and Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Budgets */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Active Budgets</h2>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => router.push('/budgets')}
              testId="view-all-budgets-button"
            >
              View All
            </Button>
          </div>
          
          {dashboardData?.activeBudgets && dashboardData.activeBudgets.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.activeBudgets.map((budget) => {
                const percentage = Math.min(
                  Math.round((budget.spent / budget.amount) * 100),
                  100
                );
                return (
                  <div key={budget._id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {budget.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          percentage >= 90 ? 'bg-red-600' : percentage >= 75 ? 'bg-yellow-400' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No active budgets. Create a budget to track your spending.
            </p>
          )}
        </div>
        
        {/* Financial Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Financial Goals</h2>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => router.push('/goals')}
              testId="view-all-goals-button"
            >
              View All
            </Button>
          </div>
          
          {dashboardData?.upcomingGoals && dashboardData.upcomingGoals.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.upcomingGoals.map((goal) => {
                const percentage = Math.min(
                  Math.round((goal.currentAmount / goal.targetAmount) * 100),
                  100
                );
                return (
                  <div key={goal._id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {goal.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Due by: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No financial goals. Set goals to track your saving progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
