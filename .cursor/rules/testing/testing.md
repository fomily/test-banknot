---
applyContext: testing
---

# 🧪 Testing Guidelines

Этот файл описывает правила тестирования: unit, integration, e2e тесты и лучшие практики.

## Типы тестов

### 1. Unit Tests

Тестирование **use-cases** и **utility функций** изолированно.

**Где:**
- `apps/server/src/<domain>/__tests__/`
- `packages/<package>/src/__tests__/`

**Что тестируем:**
- Use-cases (бизнес-логика)
- Utility functions
- Services (JWT, Password Hasher)
- Валидация (zod schemas)

**Framework:** Jest или Vitest

### 2. Integration Tests

Тестирование **API эндпоинтов** с реальной БД (test database).

**Где:**
- `apps/server/__tests__/integration/`

**Что тестируем:**
- HTTP endpoints
- Middleware chain
- Database operations
- Auth flow

**Framework:** Jest + Supertest

### 3. E2E Tests

Тестирование **полного user flow** с UI.

**Где:**
- `tests/` (корень проекта)

**Что тестируем:**
- Регистрация/логин
- Открытие продукта
- Создание транзакции
- Навигация

**Framework:** Playwright

## Unit Testing

### Структура unit теста:

```typescript
// apps/server/src/auth/__tests__/registerUser.test.ts
import { registerUser } from '../index'
import { prisma } from '../../prisma'

// Mock Prisma
jest.mock('../../prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}))

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new user with wallet', async () => {
    // Arrange
    const email = 'test@example.com'
    const password = 'password123'

    prisma.user.findUnique.mockResolvedValue(null) // No existing user
    prisma.user.create.mockResolvedValue({
      id: 'uuid',
      email,
      ratingLevel: 3,
      wallet: { balanceMinor: 0, currency: 'RUB' }
    })

    // Act
    const result = await registerUser({ email, password })

    // Assert
    expect(result).toHaveProperty('id')
    expect(result.email).toBe(email)
    expect(result.ratingLevel).toBe(3)
  })

  it('should throw error if email already exists', async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue({ id: 'existing-uuid' })

    // Act & Assert
    await expect(registerUser({ email: 'test@example.com', password: '123' }))
      .rejects.toThrow('Email already exists')
  })
})
```

### Тестирование services:

```typescript
// packages/security/__tests__/JwtTokenService.test.ts
import { JwtTokenService } from '../src/tokenService'

describe('JwtTokenService', () => {
  const secret = 'test-secret-key-minimum-32-chars'
  const service = new JwtTokenService(secret)

  it('should sign and verify token', () => {
    const payload = { userId: 'user-123' }
    const token = service.sign(payload, '15m')

    const verified = service.verify(token)

    expect(verified.userId).toBe('user-123')
  })

  it('should throw error for invalid token', () => {
    expect(() => service.verify('invalid-token')).toThrow()
  })
})
```

## Integration Testing

### Настройка test database:

```bash
# .env.test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banknot_test
```

```typescript
// apps/server/__tests__/setup.ts
import { prisma } from '../src/prisma'

beforeAll(async () => {
  // Apply migrations to test DB
  await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
  // Run migrations
})

afterEach(async () => {
  // Clear data between tests
  await prisma.transaction.deleteMany()
  await prisma.userProducts.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.user.deleteMany()
  await prisma.product.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
```

### Integration test example:

```typescript
// apps/server/__tests__/integration/auth.test.ts
import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/prisma'

describe('POST /auth/register', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123'
      })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('newuser@example.com')

    // Check database
    const user = await prisma.user.findUnique({
      where: { email: 'newuser@example.com' },
      include: { wallet: true }
    })

    expect(user).toBeDefined()
    expect(user.wallet.balanceMinor).toBe(0)
  })

  it('should return 400 if email already exists', async () => {
    // Create existing user
    await prisma.user.create({
      data: {
        email: 'existing@example.com',
        passwordHash: 'hash',
        ratingLevel: 3,
        wallet: { create: { balanceMinor: 0, currency: 'RUB' } }
      }
    })

    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'existing@example.com',
        password: 'password123'
      })
      .expect(400)

    expect(response.body.error).toBeDefined()
  })
})

describe('POST /auth/login', () => {
  beforeEach(async () => {
    // Create test user
    await request(app)
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
  })

  it('should login and return access token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200)

    expect(response.body).toHaveProperty('accessToken')

    // Check refresh cookie
    const cookies = response.headers['set-cookie']
    expect(cookies).toBeDefined()
    expect(cookies[0]).toMatch(/refreshToken=/)
  })
})
```

### Testing protected routes:

```typescript
describe('GET /users/me', () => {
  let accessToken: string

  beforeEach(async () => {
    // Register and login
    await request(app)
      .post('/auth/register')
      .send({ email: 'user@example.com', password: 'password123' })

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })

    accessToken = loginRes.body.accessToken
  })

  it('should return user profile', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(response.body.email).toBe('user@example.com')
  })

  it('should return 401 without token', async () => {
    await request(app)
      .get('/users/me')
      .expect(401)
  })
})
```

## E2E Testing

### Playwright setup:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev:client',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E test example:

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/')

    // Click register
    await page.click('text=Регистрация')

    // Fill form
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit
    await page.click('button[type="submit"]')

    // Check redirect to main screen
    await expect(page).toHaveURL('/main')
    await expect(page.locator('text=Главная')).toBeVisible()
  })

  test('should login existing user', async ({ page }) => {
    await page.goto('/')

    // Fill login form
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Check logged in
    await expect(page).toHaveURL('/main')
  })
})
```

### E2E test for product opening:

```typescript
// tests/products.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/main')
  })

  test('should open savings account', async ({ page }) => {
    // Navigate to products
    await page.click('text=Продукты')
    await expect(page).toHaveURL('/products')

    // Click on savings product
    await page.click('text=Накопительный счёт')

    // Fill initial deposit
    await page.fill('input[name="initialDeposit"]', '10000')

    // Click open
    await page.click('text=Открыть')

    // Check success message
    await expect(page.locator('text=Счёт успешно открыт')).toBeVisible()

    // Check product appears in "My products"
    await page.click('text=Главная')
    await expect(page.locator('text=Накопительный счёт')).toBeVisible()
  })
})
```

## Linters и Code Quality

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npm run format
```

### TypeScript Check

```bash
npm run typecheck
```

## Test Coverage

```bash
npm run test:coverage
```

**Цели покрытия:**
- Use-cases: 80%+
- Services: 90%+
- API endpoints: 70%+

## Best Practices

### ✅ DO:

1. **Пиши тесты для use-cases** - основная бизнес-логика
2. **Используй test database** для integration тестов
3. **Мокай внешние зависимости** в unit тестах
4. **Очищай БД между тестами** (afterEach)
5. **Используй descriptive test names** - что тестируется
6. **Arrange-Act-Assert** паттерн в тестах
7. **Тестируй edge cases** (ошибки, граничные значения)
8. **Запускай тесты локально** перед push

### ❌ DON'T:

1. **НЕ тестируй UI компоненты на бизнес-логику** - её там нет
2. **НЕ используй production БД** для тестов
3. **НЕ делай тесты зависимыми** друг от друга
4. **НЕ игнорируй failing tests**
5. **НЕ тестируй implementation details** - тестируй поведение

## CI Integration

### GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linters
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

**Следуй этим правилам для качественного тестирования!**

