import { expect, test } from '@playwright/test';

test('a visitor can create an account and reach onboarding', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.test`;

  await page.goto('/signup');
  await page.getByLabel('Preferred name').fill('E2E Volunteer');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill('E2e-test-password-123!');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page).toHaveURL(/\/app\/onboarding\/basics$/);
  await expect(page.getByRole('heading', { name: 'About you' })).toBeVisible();
});