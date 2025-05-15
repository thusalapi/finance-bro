import { test, expect } from '@playwright/test';

test('Add transaction test 1', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('input-email-input').click();
    await page.getByTestId('input-email-input').fill('jshehan@gmail.com');
    await page.getByTestId('input-password-input').click();
    await page.getByTestId('input-password-input').fill('shehan');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('button-new-transaction-button').click();
    await page.locator('select[name="type"]').selectOption('income');
    await page.getByTestId('input-transaction-amount').click();
    await page.getByTestId('input-transaction-amount').fill('5000');
    await page.getByTestId('transaction-category').selectOption('Food');
    await page.getByTestId('input-transaction-tags').click();
    await page.getByTestId('input-transaction-tags').fill('monthly');
    await page.getByTestId('transaction-description').click();
    await page.getByTestId('transaction-description').fill('salary');
    await page.getByTestId('input-transaction-date').fill('2025-05-25');
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.locator('div').filter({ hasText: 'DateCategoryRecurringAmountActions5/25/2025FoodNo+5000.00 USDEditDelete5/25/' }).nth(1)).toBeVisible();
});

test('Add transaction test 2', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('input-email-input').click();
    await page.getByTestId('input-email-input').fill('jshehan@gmail.com');
    await page.getByTestId('input-password-input-label').click();
    await page.getByTestId('input-password-input').click();
    await page.getByTestId('input-password-input').fill('shehan');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('button-new-transaction-button').click();
    await page.getByText('Transaction Type *').click();
    await page.getByTestId('input-transaction-amount').click();
    await page.getByTestId('input-transaction-amount').fill('200');
    await page.getByTestId('transaction-category').selectOption('Food');
    await page.locator('select[name="currency"]').selectOption('INR');
    await page.getByText('Currency *USDEURLKRGBPAUDCADINRSGDJPYCHF').click();
    await page.getByTestId('input-transaction-tags').click();
    await page.getByTestId('input-transaction-tags').fill('groceries');
    await page.getByTestId('transaction-description').click();
    await page.getByTestId('transaction-description').fill('For home');
    await page.getByTestId('input-transaction-date').fill('2025-05-11');
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.locator('div').filter({ hasText: 'DateCategoryRecurringAmountActions5/25/2025FoodNo+5000.00 USDEditDelete5/25/' }).nth(1)).toBeVisible();
});

test('Add transaction test 3 - Negative', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('input-email-input').click();
    await page.getByTestId('input-email-input').fill('jshehan@gmail.com');
    await page.getByTestId('input-password-input').click();
    await page.getByTestId('input-password-input').fill('shehan');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('button-new-transaction-button').click();
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByTestId('transaction-form').getByRole('heading', { name: 'Add New Transaction' })).toBeVisible();
});

test('Add transaction test 4 - Negative', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('input-email-input').click();
    await page.getByTestId('input-email-input').fill('jshehan@gmail.com');
    await page.getByTestId('input-password-input').click();
    await page.getByTestId('input-password-input').fill('shehan');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('button-new-transaction-button').click();
    await page.getByText('Transaction Type *ExpenseIncome').click();
    await page.locator('select[name="type"]').selectOption('income');
    await page.getByTestId('input-transaction-amount').click();
    await page.getByTestId('input-transaction-amount').fill('-1000');
    await page.locator('select[name="currency"]').selectOption('EUR');
    await page.getByTestId('transaction-category').selectOption('Food');
    await page.getByTestId('input-transaction-tags').click();
    await page.getByTestId('input-transaction-tags').fill('groceries');
    await page.getByTestId('input-transaction-date').fill('2025-05-01');
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    await expect(page.getByTestId('transaction-form').getByRole('heading', { name: 'Add New Transaction' })).toBeVisible();
});

test('Add transaction test 5 - Negative', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByTestId('button-login-button').click();
    await page.getByTestId('input-email-input').click();
    await page.getByTestId('input-email-input').fill('shehan@gmail.com');
    await page.getByTestId('input-password-input').click();
    await page.getByTestId('input-password-input').fill('shehan');
    await page.getByTestId('button-login-button').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
});