import { test, expect } from "@playwright/test";
import {
  AUTH_TEST_IDS,
  NAV_TEST_IDS,
  DASHBOARD_TEST_IDS,
  TRANSACTION_TEST_IDS,
} from "@/utils/testIds";

/**
 * Transaction Management Test Suite
 * This suite tests creating, listing, filtering, and deleting transactions
 */
test.describe("Transaction Management Flows", () => {
  const uniqueId = Date.now();
  const testEmail = `test.user.${uniqueId}@example.com`;
  const testPassword = "Password123!";
  const testName = "Test User";

  // Define test transaction data
  const testTransaction = {
    description: "Grocery Shopping",
    amount: "75.50",
    category: "Food",
    notes: "Weekly groceries at Whole Foods",
    tags: "groceries,food,weekly",
  };

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Use unique email for each test run to avoid conflicts
    const uniqueEmail = `test.user.${
      uniqueId + Math.floor(Math.random() * 1000)
    }@example.com`;

    // Make sure registration form is visible
    await expect(page.getByTestId(AUTH_TEST_IDS.registerForm)).toBeVisible();

    // Fill out registration form
    await page.getByTestId(AUTH_TEST_IDS.nameInput).fill(testName);
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill(uniqueEmail);
    await page.getByTestId(AUTH_TEST_IDS.passwordInput).fill(testPassword);
    await page
      .getByTestId(AUTH_TEST_IDS.confirmPasswordInput)
      .fill(testPassword);
    await page.getByTestId(AUTH_TEST_IDS.registerButton).click();

    // Wait for dashboard to load with increased timeout
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardPage)
    ).toBeVisible({
      timeout: 10000,
    });
    await page.waitForLoadState("networkidle");
  });

  test("should navigate to transactions page", async ({ page }) => {
    // Click on transactions link in navbar
    await page.getByTestId(NAV_TEST_IDS.navTransactions).click();

    // Should be on transactions page with proper URL
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Verify the transactions page has loaded
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionsPage)
    ).toBeVisible({
      timeout: 5000,
    });

    // Verify the page title is displayed
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionsTitle)
    ).toContainText("Transactions");
  });

  test("should create a new expense transaction", async ({ page }) => {
    // Navigate to transactions page via navbar
    await page.getByTestId(NAV_TEST_IDS.navTransactions).click();
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Click the new transaction button
    const newTransactionBtn = page.getByTestId(
      TRANSACTION_TEST_IDS.newTransactionButton
    );
    await expect(newTransactionBtn).toBeVisible({ timeout: 5000 });
    await newTransactionBtn.click();

    // Verify we're on the new transaction page
    await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Wait for form to be visible
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionForm)
    ).toBeVisible({
      timeout: 5000,
    });

    // Select expense type (should be default)
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.typeExpense)
    ).toBeChecked({
      timeout: 3000,
    });

    // Fill the form with explicit waits between inputs to improve reliability
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionDescription)
      .fill(testTransaction.description);
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionAmount)
      .fill(testTransaction.amount);

    // Select category using a more reliable approach
    const categorySelect = page.getByTestId(
      TRANSACTION_TEST_IDS.transactionCategory
    );
    await expect(categorySelect).toBeVisible({ timeout: 3000 });
    await categorySelect.selectOption(testTransaction.category);

    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionNotes)
      .fill(testTransaction.notes);
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionTags)
      .fill(testTransaction.tags);

    // Submit the form
    const submitBtn = page.getByTestId(TRANSACTION_TEST_IDS.submitTransaction);
    await expect(submitBtn).toBeVisible({ timeout: 3000 });
    await submitBtn.click();

    // Should be redirected back to transactions page
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Verify the newly created transaction appears in the list
    const transactionsList = page.getByTestId(
      TRANSACTION_TEST_IDS.transactionsList
    );
    await expect(transactionsList).toBeVisible({ timeout: 5000 });

    // Check that our transaction description appears
    const expenseRow = page.getByText(testTransaction.description).first();
    await expect(expenseRow).toBeVisible({ timeout: 5000 });

    // Verify the amount appears with the correct format
    await expect(
      page.getByText(`$${testTransaction.amount}`).first()
    ).toBeVisible({ timeout: 3000 });
  });

  test("should create a new income transaction", async ({ page }) => {
    // Navigate to new transaction page
    await page.getByTestId(NAV_TEST_IDS.navTransactions).click();
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    const newTransactionBtn = page.getByTestId(
      TRANSACTION_TEST_IDS.newTransactionButton
    );
    await expect(newTransactionBtn).toBeVisible({ timeout: 5000 });
    await newTransactionBtn.click();

    // Wait for form to be visible
    await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionForm)
    ).toBeVisible({
      timeout: 5000,
    });

    // Define the income transaction
    const incomeTransaction = {
      description: "Freelance Work",
      amount: "1200.00",
      category: "Income",
      notes: "Website design project",
      tags: "freelance,work,design",
    };

    // Select income type and wait for it to be checked
    const incomeRadio = page.getByTestId(TRANSACTION_TEST_IDS.typeIncome);
    await expect(incomeRadio).toBeVisible({ timeout: 3000 });
    await incomeRadio.check();
    await expect(incomeRadio).toBeChecked({ timeout: 3000 });

    // Fill the form with explicit waits between inputs
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionDescription)
      .fill(incomeTransaction.description);
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionAmount)
      .fill(incomeTransaction.amount);

    // Select category
    const categorySelect = page.getByTestId(
      TRANSACTION_TEST_IDS.transactionCategory
    );
    await expect(categorySelect).toBeVisible({ timeout: 3000 });
    await categorySelect.selectOption(incomeTransaction.category);

    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionNotes)
      .fill(incomeTransaction.notes);
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionTags)
      .fill(incomeTransaction.tags);

    // Submit the form
    const submitBtn = page.getByTestId(TRANSACTION_TEST_IDS.submitTransaction);
    await expect(submitBtn).toBeVisible({ timeout: 3000 });
    await submitBtn.click();

    // Should be redirected back to transactions page
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Verify the newly created transaction appears in the list
    const transactionsList = page.getByTestId(
      TRANSACTION_TEST_IDS.transactionsList
    );
    await expect(transactionsList).toBeVisible({ timeout: 5000 });

    // Check that our transaction description appears
    const incomeRow = page.getByText(incomeTransaction.description).first();
    await expect(incomeRow).toBeVisible({ timeout: 5000 });

    // Verify the amount appears with the correct format
    await expect(
      page.getByText(`$${incomeTransaction.amount}`).first()
    ).toBeVisible({ timeout: 3000 });
  });

  test("should validate transaction form fields", async ({ page }) => {
    // Navigate to new transaction page
    await page.getByTestId(NAV_TEST_IDS.navTransactions).click();
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    const newTransactionBtn = page.getByTestId(
      TRANSACTION_TEST_IDS.newTransactionButton
    );
    await expect(newTransactionBtn).toBeVisible({ timeout: 5000 });
    await newTransactionBtn.click();

    // Wait for navigation and form to be visible
    await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionForm)
    ).toBeVisible({
      timeout: 5000,
    });

    // Try to submit empty form
    const submitBtn = page.getByTestId(TRANSACTION_TEST_IDS.submitTransaction);
    await expect(submitBtn).toBeVisible({ timeout: 3000 });
    await submitBtn.click();

    // Should still be on the form page
    await expect(page).toHaveURL(/.*\/transactions\/new/);

    // Allow time for validation errors to appear
    await page.waitForTimeout(500);

    // Check for validation errors
    const descError = page.getByTestId(
      TRANSACTION_TEST_IDS.transactionDescriptionError
    );
    await expect(descError).toBeVisible({ timeout: 5000 });

    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionAmountError)
    ).toBeVisible();
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionCategoryError)
    ).toBeVisible();

    // Test validation for invalid input
    await page
      .getByTestId(TRANSACTION_TEST_IDS.transactionDescription)
      .fill("Test");
    await page.getByTestId(TRANSACTION_TEST_IDS.transactionAmount).fill("-10"); // Negative amount
    await submitBtn.click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Should still see error for amount but not for description
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionAmountError)
    ).toBeVisible();

    // Fix the amount but leave category empty
    await page.getByTestId(TRANSACTION_TEST_IDS.transactionAmount).fill("50");
    await submitBtn.click();

    // Should now only see error for category
    await page.waitForTimeout(500);
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionCategoryError)
    ).toBeVisible();
  });

  test("should filter transactions", async ({ page }) => {
    // First create a transaction so we have something to filter
    await test.step("Create test transaction", async () => {
      // Navigate to new transaction page
      await page.getByTestId(NAV_TEST_IDS.navTransactions).click();
      await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
      await page.waitForLoadState("networkidle");

      await page.getByTestId(TRANSACTION_TEST_IDS.newTransactionButton).click();
      await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });
      await page.waitForLoadState("networkidle");

      // Fill out form for a unique test transaction
      await page
        .getByTestId(TRANSACTION_TEST_IDS.transactionDescription)
        .fill("FILTER TEST TRANSACTION");
      await page
        .getByTestId(TRANSACTION_TEST_IDS.transactionAmount)
        .fill("100");
      await page
        .getByTestId(TRANSACTION_TEST_IDS.transactionCategory)
        .selectOption("Food");
      await page.getByTestId(TRANSACTION_TEST_IDS.submitTransaction).click();

      // Wait to return to transactions list
      await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
      await page.waitForLoadState("networkidle");
    });

    // Now test filtering
    await page.getByTestId("filters-section").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("filters-section")).toBeVisible({
      timeout: 5000,
    });

    // Test search filter
    const searchFilter = page.getByTestId("filter-search");
    await expect(searchFilter).toBeVisible({ timeout: 3000 });
    await searchFilter.fill("FILTER TEST");

    // Wait for filtering to complete
    await page.waitForLoadState("networkidle");

    // Verify our test transaction is still visible
    await expect(page.getByText("FILTER TEST TRANSACTION").first()).toBeVisible(
      { timeout: 5000 }
    );

    // Test type filter
    const typeFilter = page.getByTestId("filter-type");
    await expect(typeFilter).toBeVisible({ timeout: 3000 });
    await typeFilter.selectOption("expense");

    // Wait for filtering to complete
    await page.waitForLoadState("networkidle");

    // Reset filters
    const resetButton = page.getByTestId("reset-filters-button");
    await expect(resetButton).toBeVisible({ timeout: 3000 });
    await resetButton.click();

    // Verify filters are reset
    await expect(searchFilter).toHaveValue("");
    await expect(typeFilter).toHaveValue("");
  });

  test("should delete a transaction", async ({ page }) => {
    // Create a transaction to delete
    await test.step("Create transaction to delete", async () => {
      await page.getByTestId(NAV_TEST_IDS.navTransactions).click();
      await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
      await page.waitForLoadState("networkidle");

      await page.getByTestId(TRANSACTION_TEST_IDS.newTransactionButton).click();
      await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });

      // Fill minimal required fields
      await page
        .getByTestId(TRANSACTION_TEST_IDS.transactionDescription)
        .fill("DELETE TEST TRANSACTION");
      await page.getByTestId(TRANSACTION_TEST_IDS.transactionAmount).fill("50");
      await page
        .getByTestId(TRANSACTION_TEST_IDS.transactionCategory)
        .selectOption("Food");
      await page.getByTestId(TRANSACTION_TEST_IDS.submitTransaction).click();

      // Wait to return to transactions list
      await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
      await page.waitForLoadState("networkidle");
    });

    // Verify the transaction list is visible
    const transactionsList = page.getByTestId(
      TRANSACTION_TEST_IDS.transactionsList
    );
    await expect(transactionsList).toBeVisible({ timeout: 5000 });

    // Look for our test transaction
    await expect(page.getByText("DELETE TEST TRANSACTION").first()).toBeVisible(
      { timeout: 5000 }
    );

    // Find and click the delete button for our test transaction
    const deleteButtons = page.getByTestId(/delete-transaction-/);
    await expect(deleteButtons.first()).toBeVisible({ timeout: 3000 });

    // Click delete and handle confirmation dialog
    await deleteButtons.first().click();

    // Wait for the confirmation dialog and confirm deletion
    const confirmButton = page.getByRole("button", {
      name: /confirm|delete|yes/i,
    });
    await expect(confirmButton).toBeVisible({ timeout: 5000 });
    await confirmButton.click();

    // Wait for the transaction to be deleted (either by checking it's gone or by checking for success message)
    await page.waitForLoadState("networkidle");

    // Depending on the UI, verify deletion was successful
    // Either the item should be gone, or a success message should be visible
    try {
      // Check if transaction is no longer visible
      const transactionStillVisible = await page
        .getByText("DELETE TEST TRANSACTION")
        .isVisible();
      expect(transactionStillVisible).toBeFalsy();
    } catch {
      // If the above fails, look for success message
      const successMessage = page.getByText(
        /successfully deleted|transaction deleted/i
      );
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });
});
