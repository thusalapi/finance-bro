"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { transactions } from "@/utils/apiClient";
import { TRANSACTION_TEST_IDS } from "@/utils/testIds";

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  tags?: string[];
  currency: string;
  recurring?: {
    isRecurring: boolean;
    frequency?: string;
  };
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    // Load transactions if user is authenticated
    if (user) {
      loadTransactions();
      // Extract unique categories from transactions for filter dropdown
      extractCategories();
    }
  }, [user, authLoading, router]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await transactions.getAll();
      setTransactionsList(response);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load transactions");
      setIsLoading(false);
    }
  };

  const extractCategories = () => {
    const uniqueCategories = new Set<string>();

    transactionsList.forEach((transaction) => {
      if (transaction.category) {
        uniqueCategories.add(transaction.category);
      }
    });

    setCategories(Array.from(uniqueCategories));
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactions.delete(id);
      setTransactionsList(
        transactionsList.filter((transaction) => transaction._id !== id)
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setCategoryFilter("");
    setDateFilter("");
  };

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let filterData: any = {};

      if (typeFilter) filterData.type = typeFilter;
      if (categoryFilter) filterData.category = categoryFilter;

      if (dateFilter) {
        const selectedDate = new Date(dateFilter);
        const nextDay = new Date(dateFilter);
        nextDay.setDate(nextDay.getDate() + 1);

        filterData.startDate = selectedDate.toISOString().split("T")[0];
        filterData.endDate = nextDay.toISOString().split("T")[0];
      }

      const response = await transactions.filter(filterData);
      setTransactionsList(response);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to filter transactions");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeFilter || categoryFilter || dateFilter) {
      applyFilters();
    }
  }, [typeFilter, categoryFilter, dateFilter]);

  // Apply search term filter locally
  const filteredTransactions = transactionsList.filter((transaction) => {
    // Skip search if empty
    if (!searchTerm) return true;

    // Check if any field contains the search term
    return (
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      transaction.amount.toString().includes(searchTerm)
    );
  });

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center p-8">Checking authentication...</div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Show loading state while fetching transactions
  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        data-testid="transactions-loading"
      >
        <div className="text-lg font-medium text-gray-500">
          Loading your transactions...
        </div>
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
    <div
      className="space-y-6"
      data-testid={TRANSACTION_TEST_IDS.transactionsPage}
    >
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold"
          data-testid={TRANSACTION_TEST_IDS.transactionsTitle}
        >
          Transactions
        </h1>
        <Button
          onClick={() => router.push("/transactions/new")}
          testId={TRANSACTION_TEST_IDS.newTransactionButton}
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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
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
            data-testid={TRANSACTION_TEST_IDS.transactionsList}
          >
            <table className="w-full">
              <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Recurring</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    data-testid={TRANSACTION_TEST_IDS.transactionItem(
                      transaction._id
                    )}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                          ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.recurring?.isRecurring ? (
                        <span className="text-purple-600 text-xs font-medium">
                          {transaction.recurring.frequency}
                        </span>
                      ) : (
                        "No"
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 text-right whitespace-nowrap font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.amount.toFixed(2)} {transaction.currency}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/transactions/${transaction._id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                        data-testid={TRANSACTION_TEST_IDS.editTransaction(
                          transaction._id
                        )}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-600 hover:text-red-900"
                        data-testid={TRANSACTION_TEST_IDS.deleteTransaction(
                          transaction._id
                        )}
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
            No transactions found. Try adjusting your filters or add a new
            transaction.
          </div>
        )}
      </div>
    </div>
  );
}
