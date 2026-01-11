import { test, expect } from "@playwright/test";

test.describe("Task Management CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    // First, login to access the dashboard
    await page.goto("/login");

    // Fill in the login form with test credentials
    await page.locator('[name="email"]').fill("test@example.com");
    await page.locator('[name="password"]').fill("password123");

    // Submit the form
    await page.locator("button[type='submit']").click();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should allow user to create a task", async ({ page }) => {
    const newTaskTitle = `Task created at ${new Date().toISOString()}`;

    // Fill in the task input
    await page.locator('input[placeholder="What needs to be done?"]').fill(newTaskTitle);

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Wait for the task to appear in the list
    await expect(page.locator(`text=${newTaskTitle}`)).toBeVisible();
  });

  test("should allow user to mark a task as completed", async ({ page }) => {
    const taskTitle = `Task to complete ${Date.now()}`;

    // Create a task first
    await page.locator('input[placeholder="What needs to be done?"]').fill(taskTitle);
    await page.locator('button[type="submit"]').click();

    // Wait for the task to appear
    const taskLocator = page.locator(`text=${taskTitle}`);
    await expect(taskLocator).toBeVisible();

    // Find the task and click the checkbox
    const taskItem = page.locator('.flex.items-center').filter({ has: taskLocator });
    await taskItem.locator('button').first().click(); // Click the checkbox button

    // Verify the task is marked as completed (strikethrough text)
    await expect(page.locator(`text=${taskTitle}`).locator("..")).toHaveClass(/line-through/);
  });

  test("should allow user to delete a task", async ({ page }) => {
    const taskTitle = `Task to delete ${Date.now()}`;

    // Create a task first
    await page.locator('input[placeholder="What needs to be done?"]').fill(taskTitle);
    await page.locator('button[type="submit"]').click();

    // Wait for the task to appear
    const taskLocator = page.locator(`text=${taskTitle}`);
    await expect(taskLocator).toBeVisible();

    // Find the task and click the delete button
    const taskItem = page.locator('.flex.items-center').filter({ has: taskLocator });
    await taskItem.locator('svg').last().click(); // Click the trash icon

    // Verify the task is removed from the list
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test("should show empty state when no tasks exist", async ({ page }) => {
    // Check if there are any tasks initially and delete them
    const taskItems = page.locator('.flex.items-center.justify-between');
    const count = await taskItems.count();

    for (let i = count - 1; i >= 0; i--) {
      // Click the delete button for each task
      await taskItems.nth(i).locator('svg').last().click();
    }

    // Verify the empty state is shown
    await expect(page.locator("text=No tasks yet")).toBeVisible();
    await expect(page.locator("text=Add a task above to get started")).toBeVisible();
  });
});