import { test, expect } from '@playwright/test';

test.describe('Ticket Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should open new ticket modal', async ({ page }) => {
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await expect(newTicketButton).toBeVisible({ timeout: 5000 });
    await newTicketButton.click();

    await page.waitForTimeout(500);
    await expect(page.getByText('Create New Ticket')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('input[name="subject"]')).toBeVisible({ timeout: 2000 });
  });

  test('should show validation when submitting empty form', async ({ page }) => {
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await newTicketButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Create New Ticket')).toBeVisible();

    const submitButton = page.getByRole('button', { name: /^create ticket$/i });
    await expect(submitButton).toBeVisible();
    
    // Try to submit - form should not submit due to required fields
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Modal should still be visible
    await expect(page.getByText('Create New Ticket')).toBeVisible();
  });

  test('should fill and submit ticket form', async ({ page }) => {
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await newTicketButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Create New Ticket')).toBeVisible();

    // Fill form
    await page.locator('input[name="subject"]').fill('E2E Test Ticket');
    await page.locator('textarea[name="description"]').fill('Test description');
    await page.locator('input[name="username"]').fill('testuser');
    await page.locator('input[name="userId"]').fill('user123');

    // Submit
    const submitButton = page.getByRole('button', { name: /^create ticket$/i });
    await submitButton.click();

    // Wait for modal to close (don't wait for network - just wait for UI)
    await expect(page.getByText('Create New Ticket')).not.toBeVisible({ timeout: 10000 });
  });
});
