import { test, expect } from "@playwright/test";

test("User Registration Validation", async ({ page }) => {
  const timestamp = new Date().getTime();
  const uniqueEmail = `john.test${timestamp}@gmail.com`;

  await page.goto("http://localhost:3000/register");
  await page.getByTestId("input-name-input").click();
  await page.getByTestId("input-name-input").fill("");
  await page.getByTestId("input-email-input").click();
  await page.getByTestId("input-name-input").click();
  await page.getByTestId("input-name-input").fill("fdsfs");
  await page.getByTestId("input-email-input").click();
  await page.getByTestId("button-register-button").click();
  await page.getByText("Full NameEmail AddressEmail").click();
  await page.getByTestId("input-name-input").click();
  await page.getByTestId("input-name-input").fill("");
  await page.getByTestId("input-name-input-error").click();
  await page.getByTestId("input-email-input-error").click();
  await page.getByTestId("input-name-input").click();
  await page.getByTestId("input-name-input").fill("John");
  await page.getByTestId("input-email-input").click();
  await page.getByTestId("input-email-input").fill("jathipala");
  await page.getByTestId("input-email-input-error").click();
  await expect(page.getByTestId("input-email-input-error")).toContainText(
    "Email is invalid"
  );
  await page.getByTestId("input-email-input").click();
  await page.getByTestId("input-email-input").fill(uniqueEmail);
  await page.getByTestId("input-password-input").click();
  await page.getByTestId("input-password-input").fill("test");
  await page.getByTestId("input-confirm-password-input").click();
  await page.getByTestId("input-confirm-password-input").fill("te");
  await page.getByTestId("input-password-input").click();
  await page.getByTestId("button-register-button").click();
  await page.getByTestId("input-password-input-error").click();
  await page.getByTestId("input-password-input").dblclick();
  await page.getByTestId("input-password-input").fill("Test@123");
  await expect(
    page.getByTestId("input-confirm-password-input-error")
  ).toContainText("Passwords do not match");
  await page.getByTestId("input-confirm-password-input").click();
  await page.getByTestId("input-confirm-password-input").fill("Test@123");
  await page.getByTestId("button-register-button").click();
  await expect(page.getByTestId("dashboard-page")).toBeVisible();
});
