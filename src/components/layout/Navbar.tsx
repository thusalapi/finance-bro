"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow" data-testid="navbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600"
              data-testid="nav-logo"
            >
              Finance Tracker
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  data-testid="nav-dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  href="/transactions"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  data-testid="nav-transactions"
                >
                  Transactions
                </Link>
                <Link
                  href="/budgets"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  data-testid="nav-budgets"
                >
                  Budgets
                </Link>
                <Link
                  href="/goals"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  data-testid="nav-goals"
                >
                  Goals
                </Link>
                <div className="ml-4 flex items-center">
                  <span
                    className="text-sm text-gray-700"
                    data-testid="nav-username"
                  >
                    {user.name}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="ml-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    data-testid="nav-logout-button"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  data-testid="nav-login"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  data-testid="nav-register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
