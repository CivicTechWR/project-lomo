import { expect, test } from "@playwright/test";

test("homepage loads and displays core navigation and call-to-action links", async ({ page }) => {
	await page.goto("/");

	// Hero section and primary actions
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible();

	// Navigation bar
	const nav = page.getByRole("navigation", { name: "Main navigation" });
	await expect(nav.getByRole("link", { name: "Login" })).toBeVisible();
	await expect(nav.getByRole("link", { name: "Sign Up" })).toBeVisible();

	// Brand logo link
	const logo = page.getByRole("link", { name: "LoMo" });
	await expect(logo).toBeVisible();
	await logo.click();
	await expect(page).toHaveURL("/");

	// Community action
	await expect(page.getByRole("link", { name: "Join the Community" })).toBeVisible();
});
