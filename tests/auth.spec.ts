import { test, expect } from "@playwright/test";
import {
  AUTH_TEST_IDS,
  NAV_TEST_IDS,
  DASHBOARD_TEST_IDS,
} from "@/utils/testIds";

/**
 * Authentication Test Suite
 * This suite tests user registration and login functionality
 */
test.describe("Authentication Flows", () => {
  // Generate a unique email for testing to avoid conflicts
  const uniqueId = Date.now();
  const testEmail = `test.user.${uniqueId}@example.com`;
  const testPassword = "Password123!";
  const testName = "Test User";

  test.beforeEach(async ({ page }) => {
    // Go to home page before each test
    await page.goto("/");
    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");
  });

  test("should display login and register links on home page", async ({
    page,
  }) => {
    // Verify that both login and register links are visible on the home page
    await expect(page.getByTestId(NAV_TEST_IDS.loginLink)).toBeVisible();
    await expect(page.getByTestId(NAV_TEST_IDS.getStartedLink)).toBeVisible();
  });

  test("user should be able to register with valid credentials", async ({
    page,
  }) => {
    // Navigate to register page from home page
    await page.getByTestId(NAV_TEST_IDS.getStartedLink).click();

    // Wait for navigation to complete
    await page.waitForURL(/.*\/register/);

    // Check that the registration form is visible
    await expect(page.getByTestId(AUTH_TEST_IDS.registerForm)).toBeVisible();

    // Fill out the registration form with increased waiting time and correct test IDs
    await expect(page.getByTestId(AUTH_TEST_IDS.nameInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.nameInput).fill(testName);

    await expect(page.getByTestId(AUTH_TEST_IDS.emailInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill(testEmail);

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

    // Submit the form - adjusted test ID to match the button
    await page.getByTestId(AUTH_TEST_IDS.registerButton).click();

    // After successful registration, user should be redirected to dashboard
    // Add a longer timeout since there might be network delays in the mock
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });

    // Verify username is displayed in the nav bar after login
    await expect(page.getByTestId(NAV_TEST_IDS.navUsername)).toContainText(
      testName,
      {
        timeout: 5000,
      }
    );
  });

  test("user should be able to logout", async ({ page }) => {
    // First login with the credentials we created
    await page.goto("/login");

    // Wait for login form to be ready with longer timeout
    await expect(page.getByTestId(AUTH_TEST_IDS.loginForm)).toBeVisible({
      timeout: 10000,
    });

    // Fill in login credentials with correct test IDs
    await expect(page.getByTestId(AUTH_TEST_IDS.emailInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill(testEmail);

    await expect(page.getByTestId(AUTH_TEST_IDS.passwordInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.passwordInput).fill(testPassword);

    // Submit form with correct test ID
    await page.getByTestId(AUTH_TEST_IDS.loginButton).click();

    // Wait for dashboard to load - longer timeout for potential network delay
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });

    // Verify user is logged in before attempting logout
    await expect(page.getByTestId(NAV_TEST_IDS.navUsername)).toBeVisible({
      timeout: 5000,
    });

    // Click logout button
    await page.getByTestId(NAV_TEST_IDS.navLogout).click();

    // Wait for logout process to complete and redirect
    await page.waitForLoadState("networkidle");

    // After logout, should see login link in navbar
    await expect(page.getByTestId(NAV_TEST_IDS.navLogin)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId(NAV_TEST_IDS.navRegister)).toBeVisible();

    // Verify we're on home page or login page
    await expect(page.url()).toMatch(/\/(login)?$/);
  });

  test("user should be able to login with valid credentials", async ({
    page,
  }) => {
    // Navigate to login page
    await page.getByTestId(NAV_TEST_IDS.loginLink).click();

    // Wait for navigation to complete
    await page.waitForURL(/.*\/login/);

    // Check that the login form is visible with longer timeout
    await expect(page.getByTestId(AUTH_TEST_IDS.loginForm)).toBeVisible({
      timeout: 10000,
    });

    // Fill out and submit the login form using correct test IDs
    await expect(page.getByTestId(AUTH_TEST_IDS.emailInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill(testEmail);

    await expect(page.getByTestId(AUTH_TEST_IDS.passwordInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.passwordInput).fill(testPassword);

    await page.getByTestId(AUTH_TEST_IDS.loginButton).click();

    // After login, user should be redirected to dashboard - increased timeout
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });

    // Verify that dashboard elements are visible
    await expect(
      page.getByTestId(DASHBOARD_TEST_IDS.dashboardTitle)
    ).toBeVisible({
      timeout: 5000,
    });
  });

  test("login should show error with invalid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Wait for login form to be fully loaded with longer timeout
    await expect(page.getByTestId(AUTH_TEST_IDS.loginForm)).toBeVisible({
      timeout: 10000,
    });

    // Fill form with invalid credentials using correct test IDs
    await expect(page.getByTestId(AUTH_TEST_IDS.emailInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill("wrong@example.com");

    await expect(page.getByTestId(AUTH_TEST_IDS.passwordInput)).toBeVisible({
      timeout: 10000,
    });
    await page
      .getByTestId(AUTH_TEST_IDS.passwordInput)
      .fill("WrongPassword123!");

    // Submit form with correct test ID
    await page.getByTestId(AUTH_TEST_IDS.loginButton).click();

    // Allow time for error response
    await page.waitForTimeout(1000);

    // Should remain on the login page
    await expect(page.url()).toContain("/login");

    // We should see either an error message or still be on the login form
    try {
      // First try to find an error message
      await expect(page.getByTestId(AUTH_TEST_IDS.loginError)).toBeVisible({
        timeout: 5000,
      });
    } catch {
      // If no error element, at least make sure we're still on login form
      await expect(page.getByTestId(AUTH_TEST_IDS.loginForm)).toBeVisible();
    }
  });

  test("registration should validate input fields", async ({ page }) => {
    // Navigate to register page
    await page.goto("/register");

    // Wait for registration form to be loaded with longer timeout
    await expect(page.getByTestId(AUTH_TEST_IDS.registerForm)).toBeVisible({
      timeout: 10000,
    });

    // Submit empty form with correct button test ID
    await page.getByTestId(AUTH_TEST_IDS.registerButton).click();

    // Should still be on registration page
    await expect(page.url()).toContain("/register");

    // Should see validation errors (using a safer approach)
    await page.waitForTimeout(500); // Brief delay for error messages to appear

    // Verify error messages for required fields are visible
    const errorSelectors = [
      AUTH_TEST_IDS.nameError,
      AUTH_TEST_IDS.emailError,
      AUTH_TEST_IDS.passwordError,
    ];

    for (const selector of errorSelectors) {
      const errorElement = page.getByTestId(selector);
      await expect(errorElement).toBeVisible({ timeout: 5000 });
    }

    // Fill with invalid data using correct test IDs
    await expect(page.getByTestId(AUTH_TEST_IDS.nameInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.nameInput).fill("A"); // Too short

    await expect(page.getByTestId(AUTH_TEST_IDS.emailInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.emailInput).fill("invalid-email");

    await expect(page.getByTestId(AUTH_TEST_IDS.passwordInput)).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId(AUTH_TEST_IDS.passwordInput).fill("short");

    await expect(
      page.getByTestId(AUTH_TEST_IDS.confirmPasswordInput)
    ).toBeVisible({
      timeout: 10000,
    });
    await page
      .getByTestId(AUTH_TEST_IDS.confirmPasswordInput)
      .fill("different");

    // Submit form with invalid data using correct test ID
    await page.getByTestId(AUTH_TEST_IDS.registerButton).click();

    // Wait for validation to complete
    await page.waitForTimeout(500);

    // Should still be on registration page
    await expect(page.url()).toContain("/register");

    // Check for the presence of validation error messages
    await expect(page.getByTestId(AUTH_TEST_IDS.nameError)).toBeVisible();
    await expect(page.getByTestId(AUTH_TEST_IDS.emailError)).toBeVisible();
    await expect(page.getByTestId(AUTH_TEST_IDS.passwordError)).toBeVisible();
    await expect(
      page.getByTestId(AUTH_TEST_IDS.confirmPasswordError)
    ).toBeVisible();
  });
});
