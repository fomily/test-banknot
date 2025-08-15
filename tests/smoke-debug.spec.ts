import { test, expect } from '@playwright/test'

test('login form renders (debug)', async ({ page }) => {
  const logs: string[] = []
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', err => logs.push(`[pageerror] ${err.message}`))
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
  // Wait for root to have any child content
  await page.waitForSelector('#root :first-child', { timeout: 10000 })
  // Try to find the auth header
  const header = page.getByText('Войти или зарегистрироваться')
  const isVisible = await header.isVisible().catch(() => false)
  if (!isVisible) {
    const html = await page.content()
    console.log('--- PAGE HTML ---')
    console.log(html.slice(0, 2000))
    console.log('--- CONSOLE LOGS ---')
    console.log(logs.join('\n'))
  }
  await expect(header).toBeVisible({ timeout: 10000 })
})
