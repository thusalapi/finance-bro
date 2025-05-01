"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { transactions as transactionApi } from "@/utils/apiClient";
import { TRANSACTION_TEST_IDS } from "@/utils/testIds";

interface TransactionFormProps {
  transactionId?: string;
  isEdit?: boolean;
}

interface FormState {
  type: "income" | "expense";
  amount: string;
  currency: string;
  category: string;
  date: string;
  tags: string;
  isRecurring: boolean;
  frequency: "daily" | "weekly" | "monthly" | "annually" | "";
  startDate: string;
  endDate: string;
  description: string;
}

const TransactionForm = ({
  transactionId,
  isEdit = false,
}: TransactionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([
    "Salary",
    "Food",
    "Transportation",
    "Housing",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Education",
    "Investments",
    "Other",
  ]);
  const [currencies, setCurrencies] = useState<string[]>([
    "USD",
    "EUR",
    "LKR",
    "GBP",
    "AUD",
    "CAD",
    "INR",
    "SGD",
    "JPY",
    "CHF",
  ]);

  const [form, setForm] = useState<FormState>({
    type: "expense",
    amount: "",
    currency: "USD",
    category: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    isRecurring: false,
    frequency: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: "",
  });

  useEffect(() => {
    // Fetch transaction details if editing
    if (isEdit && transactionId) {
      fetchTransactionDetails();
    }
  }, [isEdit, transactionId]);

  const fetchTransactionDetails = async () => {
    try {
      setIsLoading(true);
      const transaction = await transactionApi.getById(transactionId!);

      // Format the dates from ISO string to YYYY-MM-DD
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
      };

      setForm({
        type: transaction.type,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        category: transaction.category,
        date: formatDate(transaction.date),
        tags: transaction.tags ? transaction.tags.join(", ") : "",
        isRecurring: transaction.recurring?.isRecurring || false,
        frequency: transaction.recurring?.frequency || "",
        startDate: formatDate(transaction.recurring?.startDate || ""),
        endDate: formatDate(transaction.recurring?.endDate || ""),
        description: transaction.description || "",
      });

      setIsLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch transaction details"
      );
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox for isRecurring
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      // Format the form data
      const transactionData = {
        type: form.type,
        amount: parseFloat(form.amount),
        currency: form.currency,
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()) : [],
        description: form.description,
      };

      // Add date or recurring details based on isRecurring
      if (form.isRecurring) {
        Object.assign(transactionData, {
          recurring: {
            isRecurring: true,
            frequency: form.frequency,
            startDate: form.startDate,
            endDate: form.endDate,
          },
        });
      } else {
        Object.assign(transactionData, {
          date: form.date,
        });
      }

      // Update or create transaction
      if (isEdit && transactionId) {
        await transactionApi.update(transactionId, transactionData);
      } else {
        await transactionApi.create(transactionData);
      }

      // Redirect back to transactions page
      router.push("/transactions");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save transaction");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow"
      data-testid={TRANSACTION_TEST_IDS.transactionForm}
    >
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Transaction" : "Add New Transaction"}
      </h2>

      {error && (
        <div
          className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded"
          data-testid={TRANSACTION_TEST_IDS.transactionFormError}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type *
            </label>
            <div className="mt-1">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                data-testid={TRANSACTION_TEST_IDS.transactionType}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Amount *"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={handleChange}
            required
            testId={TRANSACTION_TEST_IDS.transactionAmount}
          />

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency *
            </label>
            <div className="mt-1">
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                data-testid={TRANSACTION_TEST_IDS.transactionCurrency}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <div className="mt-1">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                data-testid={TRANSACTION_TEST_IDS.transactionCategory}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="groceries, monthly, essentials"
            testId={TRANSACTION_TEST_IDS.transactionTags}
          />

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="mt-1">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                data-testid={TRANSACTION_TEST_IDS.transactionDescription}
              />
            </div>
          </div>

          {/* Is Recurring */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                id="isRecurring"
                name="isRecurring"
                type="checkbox"
                checked={form.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                data-testid={TRANSACTION_TEST_IDS.transactionIsRecurring}
              />
              <label
                htmlFor="isRecurring"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                This is a recurring transaction
              </label>
            </div>
          </div>

          {/* Conditional fields based on transaction type */}
          {form.isRecurring ? (
            <>
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <div className="mt-1">
                  <select
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required={form.isRecurring}
                    data-testid={TRANSACTION_TEST_IDS.transactionFrequency}
                  >
                    <option value="" disabled>
                      Select frequency
                    </option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Start Date */}
              <Input
                label="Start Date *"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required={form.isRecurring}
                testId={TRANSACTION_TEST_IDS.transactionStartDate}
              />

              {/* End Date */}
              <Input
                label="End Date *"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required={form.isRecurring}
                testId={TRANSACTION_TEST_IDS.transactionEndDate}
              />
            </>
          ) : (
            /* Date for non-recurring transactions */
            <Input
              label="Date *"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required={!form.isRecurring}
              testId={TRANSACTION_TEST_IDS.transactionDate}
            />
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            testId={TRANSACTION_TEST_IDS.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            testId={TRANSACTION_TEST_IDS.saveTransactionButton}
          >
            {isEdit ? "Update Transaction" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
