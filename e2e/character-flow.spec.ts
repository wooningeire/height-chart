import { test, expect } from '@playwright/test';

test('landing page renders and shows add character UI', async ({ page }) => {
    await page.goto('/');

    const addButton = page.getByRole("button", {name: "Add a character"});
    await expect(addButton).toBeVisible();

    await expect(page.locator('canvas')).toHaveCount(1);
});

