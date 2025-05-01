"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setError(null);
      
      // Login and get token
      const result = await login(email, password);
      console.log("Login successful:", result);
      
      // Navigate to dashboard after successful login
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8" data-testid="login-form">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Personal Finance Tracker
          </h1>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div 
              className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded"
              data-testid="login-error"
            >
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              testId="email-input"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              testId="password-input"
            />
          </div>
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              testId="login-button"
            >
              Sign in
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
