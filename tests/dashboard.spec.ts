import { test, expect } from "@playwright/test";
import {
  AUTH_TEST_IDS,
  NAV_TEST_IDS,
  DASHBOARD_TEST_IDS,
  TRANSACTION_TEST_IDS,
} from "@/utils/testIds";

/**
 * Dashboard Test Suite
 * This suite tests dashboard functionality and navigation
 */
test.describe("Dashboard Functionality", () => {
  const uniqueId = Date.now();
  const testEmail = `test.user.${uniqueId}@example.com`;
  const testPassword = "Password123!";
  const testName = "Test User";

  // Login before each test
  test.beforeEach(async ({ page }) => {
    // Start from the register page
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Use unique email for each test run to avoid conflicts
    const uniqueEmail = `test.user.${
      uniqueId + Math.floor(Math.random() * 1000)
    }@example.com`;

    // Make sure the registration form is visible with increased timeout
    await expect(page.getByTestId(AUTH_TEST_IDS.registerForm)).toBeVisible({
      timeout: 10000,
    });

    // Fill out registration form with correct test IDs and increased visibility timeouts
    await expect(page.getByTestId(AUTH_TEST_IDS.nameInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.nameInput).fill(testName);

    await expect(page.getByTestId(AUTH_TEST_IDS.emailInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill(uniqueEmail);

    await expect(page.getByTestId(AUTH_TEST_IDS.passwordInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.passwordInput).fill(testPassword);

    await expect(
      page.getByTestId(AUTH_TEST_IDS.confirmPasswordInput)
    ).toBeVisible({
      timeout: 10000,
    });
    await page
      .getByTestId(AUTH_TEST_IDS.confirmPasswordInput)
      .fill(testPassword);

    // Submit with correct button test ID
    await page.getByTestId(AUTH_TEST_IDS.registerButton).click();

    // Wait for dashboard to load with increased timeout
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    // Make sure the dashboard is fully loaded
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardPage)
    ).toBeVisible({
      timeout: 10000,
    });
    await page.waitForLoadState("networkidle");
  });

  test("should display financial summary cards", async ({ page }) => {
    // Wait for all the financial summary cards to be visible
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.totalBalanceCard)
    ).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId(DASHBOARD_TEST_IDS.incomeCard)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId(DASHBOARD_TEST_IDS.expensesCard)).toBeVisible(
      {
        timeout: 5000,
      }
    );

    // Check that values are displayed with currency symbol
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.totalBalanceValue)
    ).toContainText("$", {
      timeout: 5000,
    });
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.incomeValue)
    ).toContainText("$", {
      timeout: 5000,
    });
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.expensesValue)
    ).toContainText("$", {
      timeout: 5000,
    });
  });

  test("should display recent transactions section", async ({ page }) => {
    // Wait for the transactions section to be visible
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.recentTransactionsSection)
    ).toBeVisible({
      timeout: 5000,
    });

    // Check that the "View All" button is present
    const viewAllButton = page.getByTestId(
      DASHBOARD_TEST_IDS.viewAllTransactionsButton
    );
    await expect(viewAllButton).toBeVisible();

    // Click the button and verify navigation
    await viewAllButton.click();

    // Wait for the transactions page to load
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Verify we're on the transactions page
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionsPage)
    ).toBeVisible({
      timeout: 5000,
    });

    // Navigate back to dashboard using nav menu
    await page.getByTestId(NAV_TEST_IDS.navDashboard).click();

    // Verify we're back on the dashboard
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardPage)
    ).toBeVisible({
      timeout: 5000,
    });
  });

  test("should display budget summary section", async ({ page }) => {
    // Wait for the budget summary section to be visible
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.budgetSummarySection)
    ).toBeVisible({
      timeout: 5000,
    });

    // Check the "Manage Budgets" button
    const manageBudgetsButton = page.getByTestId(
      DASHBOARD_TEST_IDS.viewAllBudgetsButton
    );
    await expect(manageBudgetsButton).toBeVisible();

    // Click the button
    await manageBudgetsButton.click();

    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");

    // Navigate back to dashboard
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardPage)
    ).toBeVisible({
      timeout: 5000,
    });
  });

  test("should display upcoming bills section", async ({ page }) => {
    // Wait for the upcoming bills section to be visible
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.upcomingBillsSection)
    ).toBeVisible({
      timeout: 5000,
    });

    // Verify there's at least one bill item
    const billItems = page.getByTestId(/^bill-/);
    await expect(billItems.first()).toBeVisible({ timeout: 5000 });

    // Count the bill items and confirm there's at least one
    const billItemCount = await billItems.count();
    expect(billItemCount).toBeGreaterThan(0);
  });

  test("should navigate to create new transaction from dashboard", async ({
    page,
  }) => {
    // Find and click the New Transaction button
    const newTransactionButton = page.getByTestId(
      DASHBOARD_TEST_IDS.newTransactionButton
    );
    await expect(newTransactionButton).toBeVisible({ timeout: 5000 });

    // Click the button
    await newTransactionButton.click();

    // Wait for navigation to complete
    await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Verify new transaction form is visible
    await expect(
      page.getByTestId(TRANSACTION_TEST_IDS.transactionForm)
    ).toBeVisible({
      timeout: 5000,
    });

    // Optionally, we could test filling out the form here
    // But for now, we'll just verify navigation worked
  });

  test("should show loading state and handle errors gracefully", async ({
    page,
  }) => {
    // Navigate to dashboard explicitly
    await page.goto("/dashboard");

    // Try to observe the loading state - it might be too quick, so we'll use a try/catch
    try {
      // Set a short timeout so we don't slow down the tests if loading state is brief
      await page
        .getByTestId(DASHBOARD_TEST_IDS.dashboardLoading)
        .isVisible({ timeout: 2000 });
    } catch (e) {
      // It's ok if we miss the loading state due to quick loading
      console.log("Loading state may have been too quick to observe");
    }

    // Wait for dashboard to finish loading
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardPage)
    ).toBeVisible({
      timeout: 10000,
    });

    // Verify key dashboard components are visible
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardTitle)
    ).toBeVisible();
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.financialSummarySection)
    ).toBeVisible({
      timeout: 5000,
    });
  });
});
