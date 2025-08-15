import { test, expect } from '@playwright/test'

test('page renders or logs errors', async ({ page }) => {
  const logs: string[] = []
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', err => logs.push(`[pageerror] ${err.message}`))
  await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 30000 })
  await page.waitForTimeout(2000)
  const inner = await page.evaluate(() => document.querySelector('#root')?.innerHTML || '')
  console.log('ROOT length:', inner.length)
  console.log('--- LOGS ---')
  console.log(logs.join('\n'))
  await expect(page.getByText('Войти или зарегистрироваться')).toBeVisible({ timeout: 10000 })
})
