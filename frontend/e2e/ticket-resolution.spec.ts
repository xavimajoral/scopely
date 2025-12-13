import { test, expect } from '@playwright/test';

test.describe('Ticket Resolution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should show resolve button when ticket is selected', async ({ page }) => {
    await page.waitForTimeout(2000);

    const ticketItems = page.locator('div[class*="ticketItem"]');
    const count = await ticketItems.count();

    if (count > 0) {
      await ticketItems.first().click();
      await page.waitForTimeout(3000);

      const resolveButton = page.getByRole('button', { name: /^resolve$/i });
      await expect(resolveButton).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should open confirmation modal when clicking resolve', async ({ page }) => {
    await page.waitForTimeout(2000);

    const ticketItems = page.locator('div[class*="ticketItem"]');
    const count = await ticketItems.count();

    if (count > 0) {
      await ticketItems.first().click();
      await page.waitForTimeout(3000);

      const resolveButton = page.getByRole('button', { name: /^resolve$/i });
      await expect(resolveButton).toBeVisible({ timeout: 5000 });
      await resolveButton.click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Resolve Ticket')).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/are you sure/i)).toBeVisible({ timeout: 2000 });
    } else {
      test.skip();
    }
  });

  test('should cancel resolution when clicking cancel in modal', async ({ page }) => {
    await page.waitForTimeout(2000);

    const ticketItems = page.locator('div[class*="ticketItem"]');
    const count = await ticketItems.count();

    if (count > 0) {
      await ticketItems.first().click();
      await page.waitForTimeout(3000);

      const resolveButton = page.getByRole('button', { name: /^resolve$/i });
      await expect(resolveButton).toBeVisible({ timeout: 5000 });
      await resolveButton.click();
      await page.waitForTimeout(500);
      await expect(page.getByText('Resolve Ticket')).toBeVisible();

      // Get all cancel buttons and click the first one (should be the modal one)
      const cancelButtons = page.getByRole('button', { name: /^cancel$/i });
      await cancelButtons.first().click();
      await page.waitForTimeout(500);

      await expect(page.getByText('Resolve Ticket')).not.toBeVisible({ timeout: 2000 });
    } else {
      test.skip();
    }
  });
});
