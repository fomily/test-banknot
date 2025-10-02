---
applyContext: backend
---

# 🏗️ Backend: Домены и архитектура

Этот файл описывает архитектуру backend сервера, структуру доменов, use-cases и работу с базой данных.

## Архитектура backend (domain-based)

Backend построен на **Express.js** с доменной архитектурой.

### Структура сервера

```
apps/server/
├── src/
│   ├── app.ts              # Главное приложение (middlewares, роуты)
│   ├── index.ts            # Точка входа, запуск сервера
│   ├── prisma.ts           # Prisma клиент (singleton)
│   └── <domain>/           # Домены (auth, users, products, etc.)
│       └── index.ts        # Роуты + use-cases + хелперы
├── prisma/
│   ├── schema.prisma       # Схема БД
│   ├── migrations/         # Миграции
│   └── seed.ts             # Seed данные
└── package.json
```

## Домены (Domain Structure)

Каждый домен - это **один компактный файл** (или небольшое число файлов при росте).

### Что включает домен:

1. **Регистрация роутов** (`express.Router()`)
2. **Локальные use-cases** (группой в одном файле)
3. **Работа с БД** через Prisma
4. **Вспомогательные хелперы** локально внутри домена

### Пример структуры домена:

```typescript
// apps/server/src/auth/index.ts

import { Router } from 'express'
import { prisma } from '../prisma'
import { JwtTokenService } from '@packages/security'
import { BcryptPasswordHasher } from '@packages/security'

// ===== Use-cases =====

async function registerUser(params: { email: string; password: string }) {
  // 1. Проверить email
  const existing = await prisma.user.findUnique({ where: { email: params.email } })
  if (existing) throw new Error('Email already exists')

  // 2. Захешировать пароль
  const hasher = new BcryptPasswordHasher()
  const passwordHash = await hasher.hash(params.password)

  // 3. Создать пользователя
  const user = await prisma.user.create({
    data: {
      email: params.email,
      passwordHash,
      ratingLevel: 3, // средний рейтинг
      wallet: { create: { balanceMinor: 0, currency: 'RUB' } }
    },
    include: { wallet: true }
  })

  return user
}

async function loginUser(params: { email: string; password: string }) {
  // Логика логина
}

// ===== Хелперы =====

function setRefreshCookie(res: Response, token: string) {
  // Установка refresh cookie
}

// ===== Роуты =====

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    setRefreshCookie(res, result.refreshToken)
    res.json({ accessToken: result.accessToken })
  } catch (err) {
    next(err)
  }
})
```

## Правила доменов

### ✅ DO:

1. **Группируйте use-cases в одном файле домена**
2. **Use-cases решают одну конкретную задачу**
3. **Роуты только вызывают use-cases** (wire up)
4. **Хелперы держите локально** внутри домена
5. **Используйте Prisma** для работы с БД
6. **Обрабатывайте ошибки** через `try-catch` и `next(err)`

### ❌ DON'T:

1. **НЕ пишите бизнес-логику в роутах** - только в use-cases
2. **НЕ создавайте глобальные хелперы** без необходимости
3. **НЕ дублируйте код** между доменами - выносите в `packages/*`
4. **НЕ делайте прямые SQL запросы** - используйте Prisma
5. **НЕ забывайте валидацию** входных данных

## Use-cases

Use-case = функция, решающая одну конкретную бизнес-задачу.

### Принципы use-cases:

1. **Один use-case = одна задача**
2. **Чистая функция** (по возможности)
3. **Возвращает результат или бросает ошибку**
4. **Группируются в файле домена**
5. **Композиция зависимостей вручную** (без DI контейнера)

### Примеры use-cases:

```typescript
// Регистрация пользователя
async function registerUser(params: RegisterParams): Promise<User> {
  // ...
}

// Логин пользователя
async function loginUser(params: LoginParams): Promise<{ accessToken: string, refreshToken: string }> {
  // ...
}

// Обновление профиля
async function updateUserProfile(userId: string, data: ProfileData): Promise<User> {
  // ...
}

// Открытие накопительного счёта
async function openSavingsAccount(userId: string, initialDeposit: number): Promise<UserProduct> {
  // ...
}
```

## Prisma (работа с БД)

### Singleton клиент

Prisma клиент - **singleton** в `apps/server/src/prisma.ts`:

```typescript
// apps/server/src/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### Использование в доменах:

```typescript
import { prisma } from '../prisma'

const user = await prisma.user.findUnique({ where: { id: userId } })
const users = await prisma.user.findMany({ where: { role: 'USER' } })
const created = await prisma.user.create({ data: { ... } })
```

### Транзакции:

```typescript
await prisma.$transaction(async (tx) => {
  // Уменьшить баланс
  await tx.wallet.update({
    where: { userId },
    data: { balanceMinor: { decrement: amount } }
  })

  // Создать транзакцию
  await tx.transaction.create({
    data: { userId, amountMinor: amount, direction: 'DEBIT', ... }
  })

  // Создать UserProduct
  await tx.userProducts.create({
    data: { userId, productId, initialDeposit: amount }
  })
})
```

### Миграции:

```bash
npm run db:migrate       # Применить миграции
npm run db:seed          # Заполнить тестовыми данными
npm run db:reset         # Сбросить БД и применить миграции
```

## Роуты (Routes)

Роуты **ТОЛЬКО вызывают use-cases**, никакой бизнес-логики!

### Правила роутов:

```typescript
// ✅ ХОРОШО: Роут только вызывает use-case
authRouter.post('/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

// ❌ ПЛОХО: Бизнес-логика в роуте
authRouter.post('/register', async (req, res, next) => {
  // НЕ ДЕЛАТЬ ТАК!
  const existing = await prisma.user.findUnique(...)
  if (existing) return res.status(400).json({ error: 'exists' })
  const hashed = await bcrypt.hash(...)
  // ...
})
```

### Структура роутера:

```typescript
export const usersRouter = Router()

// GET /users/me
usersRouter.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await getMe(req.userId)
    res.json(user)
  } catch (err) {
    next(err)
  }
})

// PATCH /users/me/profile
usersRouter.patch('/me/profile', authMiddleware, async (req, res, next) => {
  try {
    const updated = await updateUserProfile(req.userId, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
})
```

## Middlewares и инфраструктура

### Общие middlewares (apps/server/src/app.ts):

- **helmet** - безопасность заголовков
- **CORS** - настройка CORS
- **cookie-parser** - парсинг cookies
- **express.json()** - парсинг JSON
- **rate-limit** - ограничение запросов (prod)
- **error handler** - централизованная обработка ошибок

### Health check:

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
```

### Регистрация роутов:

```typescript
// apps/server/src/app.ts
import { authRouter } from './auth'
import { usersRouter } from './users'
import { productsRouter } from './products'

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
```

## Валидация данных

Используй **zod** для валидации входных данных:

```typescript
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

authRouter.post('/register', async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body)
    const result = await registerUser(validated)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})
```

## Обработка ошибок

### Централизованный error handler:

```typescript
// apps/server/src/app.ts
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
})
```

### В use-cases:

```typescript
async function updateUserProfile(userId: string, data: ProfileData) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new Error('User not found') // Будет обработано в error handler
  }
  // ...
}
```

## TypeScript правила

1. **Строгая типизация** - используй Prisma типы
2. **Интерфейсы для параметров** use-cases
3. **Типизированные ответы** API
4. **Никаких `any`** без крайней необходимости

```typescript
import { User, Wallet } from '@prisma/client'

interface RegisterParams {
  email: string
  password: string
}

type UserWithWallet = User & { wallet: Wallet }

async function registerUser(params: RegisterParams): Promise<UserWithWallet> {
  // ...
}
```

---

**Следуй этим правилам для консистентной backend архитектуры!**
