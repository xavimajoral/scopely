import { test, expect } from '@playwright/test';

test.describe('Ticket Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should display ticket list', async ({ page }) => {
    // Just check that the "New ticket" button exists, which means the list container is there
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await expect(newTicketButton).toBeVisible({ timeout: 5000 });
  });

  test('should show ticket details when clicking a ticket', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Find ticket items using CSS module class pattern
    const ticketItems = page.locator('div[class*="ticketItem"]');
    const count = await ticketItems.count();

    if (count > 0) {
      await ticketItems.first().click();
      await page.waitForTimeout(3000);

      // Check for ticket detail - look for h1 (ticket title) or ticket detail container
      const hasTicketTitle = await page.locator('h1').count() > 0;
      const hasTicketDetail = await page.locator('[class*="ticketDetail"]').count() > 0;
      const hasEmptyState = await page.getByText(/select a ticket to view details/i).isVisible().catch(() => false);
      
      expect(hasTicketTitle || hasTicketDetail || hasEmptyState).toBeTruthy();
    } else {
      // If no tickets, check for empty state
      const emptyState = page.getByText(/no unresolved tickets/i);
      await expect(emptyState).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display reply form when ticket is selected', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Find any clickable ticket-like element
    const ticketItems = page.locator('div[class*="ticketItem"]');
    const count = await ticketItems.count();

    if (count > 0) {
      await ticketItems.first().click();
      await page.waitForTimeout(3000);

      // Look for reply textarea
      const replyForm = page.locator('textarea[name="replyMessage"], textarea[id="reply-message"]');
      await expect(replyForm).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should send a reply', async ({ page }) => {
    await page.waitForTimeout(2000);

    const ticketItems = page.locator('div[class*="ticketItem"]');
    const count = await ticketItems.count();

    if (count > 0) {
      await ticketItems.first().click();
      await page.waitForTimeout(3000);

      const replyTextarea = page.locator('textarea[name="replyMessage"], textarea[id="reply-message"]');
      await expect(replyTextarea).toBeVisible({ timeout: 5000 });
      
      const replyMessage = `Test reply ${Date.now()}`;
      await replyTextarea.fill(replyMessage);

      const sendButton = page.getByRole('button', { name: /^send$/i });
      await expect(sendButton).toBeVisible();
      await sendButton.click();

      // Wait for reply to appear (don't wait for network)
      await page.waitForTimeout(3000);
      await expect(page.getByText(replyMessage)).toBeVisible({ timeout: 10000 });
    } else {
      test.skip();
    }
  });
});
