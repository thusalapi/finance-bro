import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  testId?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  testId,
  ...props 
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} 
          p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          ${className}
        `}
        data-testid={testId}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" data-testid={`${testId}-error`}>{error}</p>
      )}
    </div>
  );
};

export default Input;
