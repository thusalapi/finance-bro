import React, { InputHTMLAttributes } from "react";
import classNames from "classnames";
import { UI_TEST_IDS } from "../../utils/testIds";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  testId?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  testId,
  ...props
}) => {
  const inputClasses = classNames(
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
    {
      "border-red-300 focus:border-red-500 focus:ring-red-500": error,
    },
    className
  );

  const inputId = testId || (props.name ? props.name : "");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-gray-700 mb-1"
          data-testid={inputId ? UI_TEST_IDS.inputLabel(inputId) : undefined}
        >
          {label}
        </label>
      )}

      <input
        className={inputClasses}
        data-testid={inputId ? UI_TEST_IDS.input(inputId) : undefined}
        {...props}
      />

      {error && (
        <p
          className="mt-1 text-sm text-red-600"
          data-testid={inputId ? UI_TEST_IDS.inputError(inputId) : undefined}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
