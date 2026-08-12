import { expect, test } from "@playwright/test";

test("homepage renders its existing primary content", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Create Next App");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /to get started, edit the page\.tsx file\./i,
    }),
  ).toBeVisible();
});
