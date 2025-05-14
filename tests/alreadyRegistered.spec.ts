import { test, expect } from "@playwright/test";

test("Already Registered User", async ({ page }) => {
  await page.goto("http://localhost:3000/register");
  await page.getByTestId("input-name-input").click();
  await page.getByTestId("input-name-input").fill("Thusala Gamage");
  await page.getByTestId("input-email-input").click();
  await page.getByTestId("input-email-input").fill("thusala@gmail.com");
  await page.getByTestId("input-email-input").press("Tab");
  await page.getByTestId("input-password-input").fill("Test@123");
  await page.getByTestId("input-password-input").press("Tab");
  await page.getByTestId("input-confirm-password-input").fill("Test@123");
  await page.getByTestId("button-register-button").click();
  await page.getByTestId("register-error").click();
  await expect(page.getByTestId("register-error")).toContainText(
    "User already exists"
  );
});
