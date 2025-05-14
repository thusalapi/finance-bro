import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
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