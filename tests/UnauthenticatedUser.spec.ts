import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByTestId('input-email-input').click();
  await page.getByTestId('input-email-input').fill('rivinsand1@gmail.com');
  await page.getByTestId('input-email-input').press('Tab');
  await page.getByTestId('input-password-input').fill('qqqqqqqq');
  await page.getByTestId('button-login-button').click();
});