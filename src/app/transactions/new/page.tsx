"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TransactionForm from "@/components/forms/TransactionForm";
import { TRANSACTION_TEST_IDS } from "@/utils/testIds";

export default function NewTransactionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        className="flex justify-center p-8"
        data-testid="transaction-page-loading"
      >
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div
      className="space-y-6"
      data-testid={TRANSACTION_TEST_IDS.transactionsPage}
    >
      <div className="flex items-center">
        <h1
          className="text-2xl font-bold"
          data-testid={TRANSACTION_TEST_IDS.transactionsTitle}
        >
          Add New Transaction
        </h1>
      </div>

      <TransactionForm />
    </div>
  );
}
