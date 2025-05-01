"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Types for our mock data
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

interface Bill {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  category: string;
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  period: "monthly" | "weekly";
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Financial summary data
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  // Other dashboard data
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    // Load dashboard data if user is authenticated
    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real application, this would be API calls
      // For now, we'll simulate loading with a timeout and mock data
      setTimeout(() => {
        // Set financial summary
        setBalance(3450.75);
        setIncome(5000);
        setExpenses(1549.25);

        // Set recent transactions
        setRecentTransactions([
          {
            id: "1",
            date: "2023-04-29",
            description: "Salary Deposit",
            amount: 5000,
            type: "income",
            category: "Income",
          },
          {
            id: "2",
            date: "2023-04-28",
            description: "Grocery Shopping",
            amount: 125.5,
            type: "expense",
            category: "Food",
          },
          {
            id: "3",
            date: "2023-04-27",
            description: "Electric Bill",
            amount: 95.4,
            type: "expense",
            category: "Utilities",
          },
          {
            id: "4",
            date: "2023-04-26",
            description: "Subscription",
            amount: 12.99,
            type: "expense",
            category: "Entertainment",
          },
        ]);

        // Set upcoming bills
        setUpcomingBills([
          {
            id: "bill-1",
            name: "Rent",
            dueDate: "2023-05-01",
            amount: 1200,
            isPaid: false,
            category: "Housing",
          },
          {
            id: "bill-2",
            name: "Internet",
            dueDate: "2023-05-05",
            amount: 65.99,
            isPaid: false,
            category: "Utilities",
          },
          {
            id: "bill-3",
            name: "Phone",
            dueDate: "2023-05-10",
            amount: 45.5,
            isPaid: false,
            category: "Utilities",
          },
        ]);

        // Set budgets
        setBudgets([
          {
            id: "budget-1",
            category: "Food",
            allocated: 500,
            spent: 325.75,
            remaining: 174.25,
            period: "monthly",
          },
          {
            id: "budget-2",
            category: "Transportation",
            allocated: 200,
            spent: 120.5,
            remaining: 79.5,
            period: "monthly",
          },
          {
            id: "budget-3",
            category: "Entertainment",
            allocated: 150,
            spent: 85.25,
            remaining: 64.75,
            period: "monthly",
          },
        ]);

        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to load dashboard data");
      setIsLoading(false);
    }
  };

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

  // Show loading state while fetching dashboard data
  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        data-testid="dashboard-loading"
      >
        <div className="text-lg font-medium text-gray-500">
          Loading your financial dashboard...
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
        <Button onClick={loadDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <h1 className="text-2xl font-bold" data-testid="dashboard-title">
        Financial Dashboard
      </h1>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div
          className="bg-white p-6 rounded-lg shadow"
          data-testid="total-balance-card"
        >
          <h2 className="text-sm font-medium text-gray-500">Total Balance</h2>
          <p
            className="text-2xl font-bold mt-2"
            data-testid="total-balance-value"
          >
            ${balance.toFixed(2)}
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow"
          data-testid="income-card"
        >
          <h2 className="text-sm font-medium text-gray-500">Monthly Income</h2>
          <p
            className="text-2xl font-bold mt-2 text-green-600"
            data-testid="income-value"
          >
            ${income.toFixed(2)}
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow"
          data-testid="expenses-card"
        >
          <h2 className="text-sm font-medium text-gray-500">Monthly Expenses</h2>
          <p
            className="text-2xl font-bold mt-2 text-red-600"
            data-testid="expenses-value"
          >
            ${expenses.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div
        className="bg-white p-6 rounded-lg shadow"
        data-testid="recent-transactions-section"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Transactions</h2>
          <Link
            href="/transactions"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            data-testid="view-all-transactions-button"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} data-testid={`transaction-${transaction.id}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{transaction.description}</td>
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
                  <td
                    className={`px-4 py-3 text-right whitespace-nowrap font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => router.push("/transactions/new")}
            testId="new-transaction-button"
          >
            New Transaction
          </Button>
        </div>
      </div>

      {/* Budget Summary */}
      <div
        className="bg-white p-6 rounded-lg shadow"
        data-testid="budget-summary-section"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Budget Summary</h2>
          <Link
            href="/budgets"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            data-testid="view-all-budgets-button"
          >
            Manage Budgets
          </Link>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => (
            <div key={budget.id} data-testid={budget.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{budget.category}</span>
                <span>
                  ${budget.spent.toFixed(2)} / ${budget.allocated.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    budget.spent / budget.allocated > 0.9
                      ? "bg-red-500"
                      : budget.spent / budget.allocated > 0.7
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${(budget.spent / budget.allocated) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Bills */}
      <div
        className="bg-white p-6 rounded-lg shadow"
        data-testid="upcoming-bills-section"
      >
        <h2 className="text-lg font-medium mb-4">Upcoming Bills</h2>

        <div className="space-y-3">
          {upcomingBills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
              data-testid={bill.id}
            >
              <div>
                <p className="font-medium">{bill.name}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(bill.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${bill.amount.toFixed(2)}</p>
                <p
                  className={`text-sm ${
                    bill.isPaid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {bill.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
