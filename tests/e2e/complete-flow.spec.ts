import { test, expect } from "@playwright/test"

test.describe("Complete User Flow", () => {
  test("should complete full video upload and purchase flow", async ({ page }) => {
    // Navigate to app
    await page.goto("/")

    // Check homepage loads
    await expect(page.locator("h1")).toContainText("Own Your Content")

    // Connect wallet (mock)
    await page.click('button:has-text("Connect Wallet")')

    // Navigate to dashboard
    await page.click('a:has-text("Dashboard")')
    await expect(page).toHaveURL(/.*dashboard/)

    // Check dashboard elements
    await expect(page.locator("text=Creator Dashboard")).toBeVisible()
    await expect(page.locator("text=Total Videos")).toBeVisible()
    await expect(page.locator("text=Total Earnings")).toBeVisible()
  })

  test("should display video cards correctly", async ({ page }) => {
    await page.goto("/")

    // Wait for videos to load
    await page.waitForSelector('[data-testid="video-card"]', { timeout: 10000 })

    // Check video card elements
    const videoCard = page.locator('[data-testid="video-card"]').first()
    await expect(videoCard.locator("img")).toBeVisible()
    await expect(videoCard.locator("text=/ETH/")).toBeVisible()
  })

  test("should show earnings dashboard for creators", async ({ page }) => {
    await page.goto("/dashboard")

    // Check earnings section
    await expect(page.locator("text=Your Earnings")).toBeVisible()
    await expect(page.locator("text=Video Sales")).toBeVisible()
    await expect(page.locator("text=Tips Received")).toBeVisible()

    // Check withdraw button
    await expect(page.locator('button:has-text("Withdraw")')).toBeVisible()
  })
})
