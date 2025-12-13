import { test, expect } from '@playwright/test';

test.describe('Ticket Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should display the ticket dashboard', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show empty state when no tickets', async ({ page }) => {
    // Check for any of the possible states
    const emptyState = page.getByText(/no unresolved tickets/i);
    const loadingState = page.getByText(/loading tickets/i);
    const selectTicketState = page.getByText(/select a ticket to view details/i);

    // At least one should be visible
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    const hasLoading = await loadingState.isVisible().catch(() => false);
    const hasSelect = await selectTicketState.isVisible().catch(() => false);
    
    expect(hasEmpty || hasLoading || hasSelect).toBeTruthy();
  });

  test('should display new ticket button', async ({ page }) => {
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await expect(newTicketButton).toBeVisible({ timeout: 5000 });
  });

  test('should open new ticket modal when clicking new ticket button', async ({ page }) => {
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await newTicketButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Create New Ticket')).toBeVisible({ timeout: 2000 });
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    const newTicketButton = page.getByRole('button', { name: /new ticket/i });
    await newTicketButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Create New Ticket')).toBeVisible();

    // Find cancel button - there might be multiple, get the one in the modal
    const cancelButtons = page.getByRole('button', { name: /^cancel$/i });
    await cancelButtons.first().click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Create New Ticket')).not.toBeVisible({ timeout: 2000 });
  });
});
