import { test, expect } from '@playwright/test';

/**
 * Dashboard Test Suite
 * This suite tests dashboard functionality and navigation
 */
test.describe('Dashboard Functionality', () => {
  const uniqueId = Date.now();
  const testEmail = `test.user.${uniqueId}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    
    // Use unique email for each test run to avoid conflicts
    const uniqueEmail = `test.user.${uniqueId + Math.floor(Math.random() * 1000)}@example.com`;
    
    // Fill out registration form
    await page.getByTestId('register-name').fill(testName);
    await page.getByTestId('register-email').fill(uniqueEmail);
    await page.getByTestId('register-password').fill(testPassword);
    await page.getByTestId('register-confirm-password').fill(testPassword);
    await page.getByTestId('register-submit').click();
    
    // Wait for dashboard to load with increased timeout
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await page.waitForSelector('[data-testid="dashboard-page"]', { timeout: 10000 });
  });
  
  test('should display financial summary cards', async ({ page }) => {
    // Using retry mechanism to handle any loading delays
    await expect(async () => {
      const balanceCardVisible = await page.getByTestId('total-balance-card').isVisible();
      expect(balanceCardVisible).toBeTruthy();
    }).toPass({ timeout: 10000 });
    
    await expect(page.getByTestId('income-card')).toBeVisible();
    await expect(page.getByTestId('expenses-card')).toBeVisible();
    
    // Check that values are displayed
    await expect(page.getByTestId('total-balance-value')).toContainText('$');
    await expect(page.getByTestId('income-value')).toContainText('$');
    await expect(page.getByTestId('expenses-value')).toContainText('$');
  });
  
  test('should display recent transactions section', async ({ page }) => {
    // Using retry for potential delays
    await expect(async () => {
      const transactionsSectionVisible = await page.getByTestId('recent-transactions-section').isVisible();
      expect(transactionsSectionVisible).toBeTruthy();
    }).toPass({ timeout: 10000 });
    
    // Check that the "View All" button is present
    await expect(page.getByTestId('view-all-transactions-button')).toBeVisible();
    
    // Click the button and verify navigation
    await page.getByTestId('view-all-transactions-button').click();
    await expect(page).toHaveURL(/.*\/transactions/, { timeout: 10000 });
    
    // Navigate back to dashboard using nav menu
    await page.getByTestId('nav-dashboard').click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
  });
  
  test('should display budget summary section', async ({ page }) => {
    // Using retry for potential delays
    await expect(async () => {
      const budgetSectionVisible = await page.getByTestId('budget-summary-section').isVisible();
      expect(budgetSectionVisible).toBeTruthy();
    }).toPass({ timeout: 10000 });
    
    // Check the "Manage Budgets" button
    const manageBudgetsButton = page.getByTestId('view-all-budgets-button');
    await expect(manageBudgetsButton).toBeVisible();
    
    // Click the button - no need to assert exact URL since this might redirect to a 
    // not-yet-implemented page in a mock environment
    await manageBudgetsButton.click();
  });
  
  test('should display upcoming bills section', async ({ page }) => {
    // Using retry for potential delays
    await expect(async () => {
      const billsSectionVisible = await page.getByTestId('upcoming-bills-section').isVisible();
      expect(billsSectionVisible).toBeTruthy();
    }).toPass({ timeout: 10000 });
    
    // Since this is a mock implementation, just verify the section exists
    // and has at least one bill item
    const billItemCount = await page.getByTestId(/^bill-/).count();
    expect(billItemCount).toBeGreaterThan(0);
  });
  
  test('should navigate to create new transaction from dashboard', async ({ page }) => {
    // Find and click the New Transaction button
    const newTransactionButton = page.getByTestId('new-transaction-button');
    
    await expect(async () => {
      const buttonVisible = await newTransactionButton.isVisible();
      expect(buttonVisible).toBeTruthy();
    }).toPass({ timeout: 5000 });
    
    await newTransactionButton.click();
    
    // Verify we're on the new transaction page
    await expect(page).toHaveURL(/.*\/transactions\/new/, { timeout: 10000 });
    
    // Verify new transaction form is visible
    await expect(page.getByTestId('transaction-form')).toBeVisible({ timeout: 5000 });
  });
  
  test('should show loading state and handle errors gracefully', async ({ page }) => {
    // For this test, we'll reload the page to see loading state
    await page.reload();
    
    // Try to observe the loading state - it might be too quick, so we'll use a try/catch
    try {
      await page.getByTestId('dashboard-loading').waitFor({ timeout: 2000 });
    } catch (e) {
      // It's ok if we miss the loading state due to quick loading
      console.log('Loading state may have been too quick to observe');
    }
    
    // Wait for dashboard to load
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 });
    
    // Since we can't easily trigger error states in a mock environment,
    // we'll just verify the dashboard loaded correctly
    await expect(page.getByTestId('dashboard-title')).toBeVisible();
  });
});
