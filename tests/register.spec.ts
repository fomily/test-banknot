import { test, expect } from '@playwright/test'

test('user can register via Auth screen', async ({ page }) => {
  const logs: string[] = []
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', err => logs.push(`[pageerror] ${err.message}`))
  page.on('response', async (resp) => {
    if (resp.url().includes('/auth') || resp.url().includes('/users')) {
      logs.push(`[response] ${resp.status()} ${resp.url()}`)
      if (!resp.ok()) {
        try { logs.push(`[response body] ${await resp.text()}`) } catch {}
      }
    }
  })
  const unique = Date.now()
  const email = `autotest+${unique}@example.com`
  const password = 'Password1!'

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 30000 })

  await expect(page.getByText('Войти или зарегистрироваться')).toBeVisible({ timeout: 10000 })

  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'Войти' }).click()

  try {
    // Either main content or menu should appear after auth
    await Promise.race([
      page.getByText('Мои продукты').waitFor({ state: 'visible', timeout: 15000 }),
      page.getByText('профиль').waitFor({ state: 'visible', timeout: 15000 }),
    ])
  } catch (e) {
    const html = await page.content()
    console.log('--- PAGE HTML ---')
    console.log(html.slice(0, 3000))
    console.log('--- LOGS ---')
    console.log(logs.join('\n'))
    throw e
  }
})

