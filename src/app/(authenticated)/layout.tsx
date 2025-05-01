"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/dashboard" className="text-white font-bold text-xl">
                  Finance Tracker
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink href="/dashboard">Dashboard</NavLink>
                  <NavLink href="/transactions">Transactions</NavLink>
                  <NavLink href="/budgets">Budgets</NavLink>
                  <NavLink href="/goals">Goals</NavLink>
                  <NavLink href="/reports">Reports</NavLink>
                </div>
              </div>
            </div>
            
            {/* User Menu - Desktop */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <div className="relative">
                  <div className="flex items-center">
                    <span className="text-gray-300 text-sm mr-2">
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink href="/transactions" onClick={() => setIsMobileMenuOpen(false)}>
                Transactions
              </NavLink>
              <NavLink href="/budgets" onClick={() => setIsMobileMenuOpen(false)}>
                Budgets
              </NavLink>
              <NavLink href="/goals" onClick={() => setIsMobileMenuOpen(false)}>
                Goals
              </NavLink>
              <NavLink href="/reports" onClick={() => setIsMobileMenuOpen(false)}>
                Reports
              </NavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center justify-between px-5">
                <div>
                  <div className="text-base font-medium leading-none text-white">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400 mt-1">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}