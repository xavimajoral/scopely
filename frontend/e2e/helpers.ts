import { Page, expect } from '@playwright/test';

/**
 * Wait for the ticket list to load
 */
export async function waitForTicketList(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional wait for React Query
}

/**
 * Wait for a ticket to be selected and details to load
 */
export async function waitForTicketDetails(page: Page) {
  await page.waitForTimeout(1000);
  const ticketDetail = page.locator('[class*="ticketDetail"]');
  await expect(ticketDetail).toBeVisible({ timeout: 5000 });
}

/**
 * Open the new ticket modal
 */
export async function openNewTicketModal(page: Page) {
  const newTicketButton = page.getByRole('button', { name: /new ticket/i });
  await newTicketButton.click();
  await page.waitForTimeout(500);
}

/**
 * Fill and submit a new ticket form
 */
export async function createTicket(
  page: Page,
  subject: string,
  description: string,
  username: string,
  userId: string
) {
  await openNewTicketModal(page);

  const subjectInput = page.getByLabel(/subject/i).or(page.locator('input[name="subject"]'));
  const descriptionInput = page.getByLabel(/description/i).or(page.locator('textarea[name="description"]'));
  const usernameInput = page.getByLabel(/username/i).or(page.locator('input[name="username"]'));
  const userIdInput = page.getByLabel(/user id/i).or(page.locator('input[name="userId"]'));

  if (await subjectInput.isVisible()) {
    await subjectInput.fill(subject);
    await descriptionInput.fill(description);
    await usernameInput.fill(username);
    await userIdInput.fill(userId);

    const submitButton = page.getByRole('button', { name: /create ticket/i });
    if (await submitButton.isVisible() && !(await submitButton.isDisabled())) {
      await submitButton.click();
      await page.waitForTimeout(2000); // Wait for ticket to be created
    }
  }
}

/**
 * Select the first ticket from the list
 */
export async function selectFirstTicket(page: Page) {
  await waitForTicketList(page);
  const ticketItems = page.locator('[class*="ticketItem"]');
  const count = await ticketItems.count();

  if (count > 0) {
    await ticketItems.first().click();
    await waitForTicketDetails(page);
    return true;
  }
  return false;
}

/**
 * Send a reply to the currently selected ticket
 */
export async function sendReply(page: Page, message: string) {
  const replyTextarea = page.locator('textarea[name="replyMessage"]').or(page.locator('textarea[id="reply-message"]'));

  if (await replyTextarea.isVisible()) {
    await replyTextarea.fill(message);
    const sendButton = page.getByRole('button', { name: /send/i });
    if (await sendButton.isVisible() && !(await sendButton.isDisabled())) {
      await sendButton.click();
      await page.waitForTimeout(2000); // Wait for reply to be sent
    }
  }
}

