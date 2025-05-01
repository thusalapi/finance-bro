"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/utils/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Try to get user info from local storage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setIsLoading(false);
            return;
          } catch (e) {
            // If parsing fails, continue to fetch user from server
            console.error('Failed to parse stored user data:', e);
          }
        }

        // Verify token and get user info
        const userData = await auth.getCurrentUser();
        setUser({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        });
      } catch (err) {
        // Clear invalid token
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await auth.login(email, password);
      console.log("Auth response:", response);
      
      // Save token and user info
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        
        // Extract user data
        const userData = {
          id: response.user?._id || '',
          name: response.user?.name || '',
          email: response.user?.email || '',
          role: response.user?.role || 'user'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update context state
        setUser(userData);
        
        return response; // Return the response for further processing
      } else {
        throw new Error('Invalid response format: missing token');
      }
    } catch (err: any) {
      console.error('Login error in context:', err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await auth.register(name, email, password);
      
      // Auto-login after successful registration
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Try to logout from server
      try {
        await auth.logout();
      } catch (logoutErr) {
        console.warn('Logout from server failed, continuing with local logout', logoutErr);
      }
      
      // Clear local storage regardless of server logout result
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update context state
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
