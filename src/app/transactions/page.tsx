"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  tags?: string[];
  notes?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Available categories for filtering
  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 
    'Entertainment', 'Healthcare', 'Income', 'Other'
  ];

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Load transactions if user is authenticated
    if (user) {
      loadTransactions();
    }
  }, [user, authLoading, router]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real application, this would be an API call
      // For now, we'll simulate loading with a timeout and mock data
      setTimeout(() => {
        const mockTransactions = [
          { 
            id: '1', 
            date: '2023-04-29', 
            description: 'Salary Deposit', 
            amount: 5000, 
            type: 'income',
            category: 'Income',
            notes: 'Monthly salary',
            tags: ['income', 'salary']
          },
          { 
            id: '2', 
            date: '2023-04-28', 
            description: 'Grocery Shopping', 
            amount: 125.50, 
            type: 'expense',
            category: 'Food',
            notes: 'Weekly grocery run',
            tags: ['food', 'groceries']
          },
          { 
            id: '3', 
            date: '2023-04-27', 
            description: 'Electric Bill', 
            amount: 95.40, 
            type: 'expense',
            category: 'Utilities',
            notes: 'Monthly electric bill',
            tags: ['bills', 'utilities']
          },
          { 
            id: '4', 
            date: '2023-04-26', 
            description: 'Subscription', 
            amount: 12.99, 
            type: 'expense',
            category: 'Entertainment',
            notes: 'Streaming service',
            tags: ['entertainment', 'subscription']
          },
          { 
            id: '5', 
            date: '2023-04-25', 
            description: 'Gas', 
            amount: 45.30, 
            type: 'expense',
            category: 'Transportation',
            notes: 'Filled up the car',
            tags: ['car', 'transportation']
          },
          { 
            id: '6', 
            date: '2023-04-24', 
            description: 'Dinner Out', 
            amount: 65.20, 
            type: 'expense',
            category: 'Food',
            notes: 'Dinner with friends',
            tags: ['food', 'eating out']
          },
          { 
            id: '7', 
            date: '2023-04-23', 
            description: 'Freelance Work', 
            amount: 350, 
            type: 'income',
            category: 'Income',
            notes: 'Website design project',
            tags: ['income', 'freelance']
          },
          { 
            id: '8', 
            date: '2023-04-22', 
            description: 'Doctor Visit', 
            amount: 25, 
            type: 'expense',
            category: 'Healthcare',
            notes: 'Co-pay for checkup',
            tags: ['health', 'medical']
          },
        ];
        
        setTransactions(mockTransactions);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load transactions');
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    // In a real app, this would make an API call
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setCategoryFilter('');
    setDateFilter('');
  };
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    if (searchTerm && 
        !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (typeFilter && transaction.type !== typeFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter && transaction.category !== categoryFilter) {
      return false;
    }
    
    // Date filter - simplified for mock data
    if (dateFilter && !transaction.date.includes(dateFilter)) {
      return false;
    }
    
    return true;
  });

  // Show loading state while checking authentication
  if (authLoading) {
    return <div className="flex justify-center p-8">Checking authentication...</div>;
  }
  
  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }
  
  // Show loading state while fetching transactions
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-500">Loading your transactions...</div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">Error</h1>
        <p className="text-red-700 mt-2">{error}</p>
        <Button onClick={loadTransactions} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="transactions-page">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" data-testid="transactions-title">Transactions</h1>
        <Button 
          onClick={() => router.push('/transactions/new')} 
          testId="new-transaction-button"
        >
          New Transaction
        </Button>
      </div>
      
      {/* Filters */}
      <div 
        className="bg-white p-6 rounded-lg shadow space-y-4"
        data-testid="filters-section"
      >
        <h2 className="text-lg font-medium">Filters</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Input
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              testId="filter-search"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              data-testid="filter-type"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              data-testid="filter-category"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              testId="filter-date"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={resetFilters} 
            variant="secondary"
            testId="reset-filters-button"
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        {filteredTransactions.length > 0 ? (
          <div 
            className="overflow-x-auto"
            data-testid="transactions-list"
          >
            <table className="w-full">
              <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    data-testid={`transaction-row-${transaction.id}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{transaction.description}</td>
                    <td className="px-4 py-3">
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
                      className={`px-4 py-3 text-right whitespace-nowrap font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                        data-testid={`delete-transaction-${transaction.id}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div 
            className="text-center py-8 text-gray-500"
            data-testid="no-transactions"
          >
            No transactions found. Try adjusting your filters or add a new transaction.
          </div>
        )}
      </div>
    </div>
  );
}
