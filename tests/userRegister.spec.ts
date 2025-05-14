import { test, expect } from "@playwright/test";

test("User Register Successfully", async ({ page }) => {
  const timestamp = new Date().getTime();
  const uniqueEmail = `john.test${timestamp}@gmail.com`;
  await page.goto("http://localhost:3000/register");
  await page.getByTestId("input-name-input").click();
  await page.getByTestId("input-name-input").fill("Sahan Gamage");
  await page.getByTestId("input-name-input").press("Tab");
  await page.getByTestId("input-email-input").fill(uniqueEmail);
  await page.getByTestId("input-email-input").press("Tab");
  await page.getByTestId("input-password-input").fill("Test@123");
  await page.getByTestId("input-password-input").press("Tab");
  await page.getByTestId("input-confirm-password-input").fill("Test@123");
  await page.getByTestId("button-register-button").click();
  await expect(page.getByTestId("dashboard-page")).toBeVisible();
});
