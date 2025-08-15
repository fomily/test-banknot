import { test, expect } from '@playwright/test'

test('login form renders', async ({ page }) => {
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
  // Look for the login/register header text present in AuthScreen
  await expect(page.getByText('Войти или зарегистрироваться')).toBeVisible({ timeout: 10000 })
})
