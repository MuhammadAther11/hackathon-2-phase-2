import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto("/login");
  });

  test("should allow a visitor to signup", async ({ page }) => {
    // Click on the sign up link
    await page.locator("text=Create an account").click();

    // Fill in the signup form
    await page.locator('[name="name"]').fill("Test User");
    await page.locator('[name="email"]').fill(`testuser${Date.now()}@example.com`);
    await page.locator('[name="password"]').fill("password123");

    // Submit the form
    await page.locator("button[type='submit']").click();

    // Verify redirect to login with success message
    await expect(page).toHaveURL(/\/login\?message=/);
    await expect(page.locator("text=Signup successful")).toBeVisible();
  });

  test("should allow registered user to login", async ({ page }) => {
    // Fill in the login form with test credentials
    await page.locator('[name="email"]').fill("test@example.com");
    await page.locator('[name="password"]').fill("password123");

    // Submit the form
    await page.locator("button[type='submit']").click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("text=Your Dashboard")).toBeVisible();
  });

  test("should show error with invalid login credentials", async ({ page }) => {
    // Fill in the login form with invalid credentials
    await page.locator('[name="email"]').fill("invalid@example.com");
    await page.locator('[name="password"]').fill("wrongpassword");

    // Submit the form
    await page.locator("button[type='submit']").click();

    // Verify error message is displayed
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("should allow user to logout", async ({ page }) => {
    // First, login using test credentials
    await page.locator('[name="email"]').fill("test@example.com");
    await page.locator('[name="password"]').fill("password123");
    await page.locator("button[type='submit']").click();

    // Wait for dashboard to load
    await expect(page.locator("text=Your Dashboard")).toBeVisible();

    // Click logout button
    await page.locator("text=Sign out").click();

    // Verify redirect to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("text=Welcome Back")).toBeVisible();
  });
});