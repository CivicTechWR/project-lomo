import { expect, test } from '@playwright/test';

test('a requester can create a request and find it in My Requests', async ({ page }) => {
  const email = `e2e-requester-${Date.now()}@example.test`;
  const requestTitle = `E2E request ${Date.now()}`;

  await page.goto('/signup');
  await page.getByLabel('Preferred name').fill('E2E Requester');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill('E2e-test-password-123!');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page).toHaveURL(/\/app\/onboarding\/basics$/);
  await page.getByLabel('First name').fill('E2E Requester');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'Stay in touch' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'Safety & Boundaries' })).toBeVisible();
  await page.getByText('I have read and understand all the safety notices', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'Set your preference' })).toBeVisible();
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/\/app$/);

  await page.getByRole('link', { name: 'My Requests' }).click();
  await expect(page.getByRole('heading', { name: 'My requests' })).toBeVisible();
  await page.getByRole('button', { name: 'New request' }).click();

  await expect(page.getByRole('heading', { name: 'How do you want to connect today?' })).toBeVisible();
  await page.getByRole('button', { name: /^Other\b/ }).click();

  await expect(page.getByRole('heading', { name: 'Other request' })).toBeVisible();
  await page.getByLabel('What do you need?').fill(requestTitle);
  await page.getByLabel('Anything else about timing?').fill('Flexible this week');
  await page.getByLabel('Location').fill('E2E community location');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'Request preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Post' }).click();
  await expect(page).toHaveURL(/\/app$/);

  await page.getByRole('link', { name: 'My Requests' }).click();
  await expect(page.getByRole('heading', { name: 'My requests' })).toBeVisible();
  await expect(page.getByRole('link', { name: new RegExp(requestTitle) })).toBeVisible();
});