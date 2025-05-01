"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface FormData {
  type: 'expense' | 'income';
  description: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
  tags: string;
}

interface FormErrors {
  description: string;
  amount: string;
  category: string;
  date: string;
  tags: string;
}

export default function NewTransactionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const expenseCategories = ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];
  const incomeCategories = ['Income', 'Investments', 'Gifts', 'Refunds', 'Other'];
  
  const [formData, setFormData] = useState<FormData>({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    notes: '',
    tags: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    description: '',
    amount: '',
    category: '',
    date: '',
    tags: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleTypeChange = (type: 'expense' | 'income') => {
    setFormData({ 
      ...formData, 
      type,
      // Reset category when changing type
      category: '' 
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {
      description: '',
      amount: '',
      category: '',
      date: '',
      tags: '',
    };
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else {
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        newErrors.amount = 'Please enter a valid positive amount';
        isValid = false;
      }
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real application, this would be an API call to create the transaction
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to transactions list
      router.push('/transactions');
      
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto" data-testid="new-transaction-page">
      <h1 className="text-2xl font-bold mb-6">New Transaction</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="transaction-form">
        {/* Transaction Type */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Transaction Type</h2>
          
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                checked={formData.type === 'expense'}
                onChange={() => handleTypeChange('expense')}
                className="mr-2"
                data-testid="type-expense"
              />
              <span>Expense</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                checked={formData.type === 'income'}
                onChange={() => handleTypeChange('income')}
                className="mr-2"
                data-testid="type-income"
              />
              <span>Income</span>
            </label>
          </div>
        </div>
        
        {/* Transaction Details */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-medium mb-4">Transaction Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Grocery Shopping"
              error={errors.description}
              testId="transaction-description"
            />
            
            <Input
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.amount}
              step="0.01"
              min="0"
              testId="transaction-amount"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                data-testid="transaction-category"
              >
                <option value="">Select a category</option>
                {formData.type === 'expense'
                  ? expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))
                  : incomeCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))
                }
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600" data-testid="transaction-category-error">
                  {errors.category}
                </p>
              )}
            </div>
            
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              testId="transaction-date"
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Add any additional details..."
                data-testid="transaction-notes"
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Tags (optional, comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., groceries, food, monthly"
                error={errors.tags}
                testId="transaction-tags"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => router.push('/transactions')}
            testId="cancel-transaction"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            isLoading={isSubmitting}
            testId="submit-transaction"
          >
            Save Transaction
          </Button>
        </div>
      </form>
    </div>
  );
}
