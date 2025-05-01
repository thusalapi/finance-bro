"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TransactionForm from "@/components/forms/TransactionForm";

export default function EditTransactionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const transactionId = params.id;
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p>Checking authentication...</p>
      </div>
    );
  }
  
  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-6" data-testid="edit-transaction-page">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Edit Transaction</h1>
      </div>
      
      <TransactionForm transactionId={transactionId} isEdit={true} />
    </div>
  );
}