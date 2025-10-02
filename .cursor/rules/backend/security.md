---
applyContext: backend
---

# 🔒 Backend: Security и аутентификация

Этот файл описывает правила безопасности, JWT аутентификацию, cookies и обработку ошибок.

## JWT Аутентификация

Проект использует **JWT** (access + refresh tokens) для аутентификации.

### Стратегия токенов

1. **Access Token** - в памяти клиента (short-lived, ~15 минут)
2. **Refresh Token** - HttpOnly+Secure cookie (long-lived, ~7 дней)

### Эндпоинты аутентификации:

- `POST /auth/register` - регистрация нового пользователя
- `POST /auth/login` - вход в систему
- `POST /auth/refresh` - обновление токенов
- `POST /auth/logout` - выход (очистка cookie)

## Cookies для WebView

### Конфигурация Refresh Cookie:

```typescript
res.cookie('refreshToken', token, {
  httpOnly: true,         // Защита от XSS
  secure: true,           // Только HTTPS (в production)
  sameSite: 'lax',        // или 'none' при необходимости
  path: '/auth/refresh',  // Доступен только для refresh эндпоинта
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
})
```

### Настройки для разных окружений:

**Development (localhost):**
```typescript
{
  httpOnly: true,
  secure: false,           // HTTP ok для localhost
  sameSite: 'lax',
  path: '/auth/refresh'
}
```

**Production (HTTPS):**
```typescript
{
  httpOnly: true,
  secure: true,            // Только HTTPS
  sameSite: 'none',        // Для cross-origin (если нужно)
  path: '/auth/refresh',
  domain: process.env.COOKIE_DOMAIN // Например, '.example.com'
}
```

### WebView особенности:

- **Базовый вариант**: refresh в HttpOnly cookie, access в памяти
- **Fallback**: если WebView не поддерживает cookies - хранение в нативном Secure Storage через bridge

### Проверка cookies:

```typescript
// Middleware для проверки refresh токена
function requireRefreshToken(req, res, next) {
  const token = req.cookies.refreshToken
  if (!token) {
    return res.status(401).json({ error: 'No refresh token' })
  }
  // Валидация токена
  next()
}
```

## Хеширование паролей

Используй **BcryptPasswordHasher** из `@packages/security`:

```typescript
import { BcryptPasswordHasher } from '@packages/security'

const hasher = new BcryptPasswordHasher()

// Хеширование при регистрации
const passwordHash = await hasher.hash(plainPassword)

// Проверка при логине
const isValid = await hasher.compare(plainPassword, passwordHash)
```

### Правила паролей:

- Минимум 8 символов
- Хеш через bcrypt (cost factor = 10)
- Никогда не храним plain passwords
- Никогда не возвращаем хеши в API

## JWT Token Service

Используй **JwtTokenService** из `@packages/security`:

```typescript
import { JwtTokenService } from '@packages/security'

const jwtService = new JwtTokenService(process.env.JWT_SECRET)

// Генерация access токена (15 минут)
const accessToken = jwtService.sign({ userId: user.id }, '15m')

// Генерация refresh токена (7 дней)
const refreshToken = jwtService.sign({ userId: user.id }, '7d')

// Валидация токена
try {
  const payload = jwtService.verify(token)
  console.log(payload.userId)
} catch (err) {
  // Токен невалиден или истёк
}
```

## Auth Middleware

### Middleware для защиты роутов:

```typescript
// Проверка access токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.slice(7) // Убрать 'Bearer '

  try {
    const payload = jwtService.verify(token)
    req.userId = payload.userId
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Использование
usersRouter.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } })
  res.json(user)
})
```

### Admin middleware:

```typescript
function adminMiddleware(req, res, next) {
  // Сначала проверяем аутентификацию
  authMiddleware(req, res, () => {
    // Затем проверяем роль
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  })
}
```

## Error Handling

### Централизованный error handler:

```typescript
// apps/server/src/app.ts

app.use((err, req, res, next) => {
  // Логирование ошибки
  console.error(err)

  // Определение статуса
  const status = err.status || err.statusCode || 500

  // Формирование ответа
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
})
```

### Типы ошибок:

```typescript
// ValidationError
class ValidationError extends Error {
  status = 400
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// UnauthorizedError
class UnauthorizedError extends Error {
  status = 401
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

// ForbiddenError
class ForbiddenError extends Error {
  status = 403
  constructor(message: string = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

// NotFoundError
class NotFoundError extends Error {
  status = 404
  constructor(message: string = 'Not Found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
```

### Использование в use-cases:

```typescript
async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user
}
```

## Helmet (Security Headers)

Используй **helmet** для безопасных HTTP заголовков:

```typescript
import helmet from 'helmet'

app.use(helmet())
```

Настройка для WebView (если нужно):

```typescript
app.use(helmet({
  contentSecurityPolicy: false, // Если WebView блокирует
  crossOriginEmbedderPolicy: false
}))
```

## Rate Limiting

Ограничение запросов в production:

```typescript
import rateLimit from 'express-rate-limit'

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // 100 запросов с одного IP
    message: 'Too many requests'
  })

  app.use('/auth', limiter) // Применить к auth эндпоинтам
}
```

## CORS

CORS настраивается через `@packages/config`:

```typescript
import { buildCorsOptions } from '@packages/config'

const corsOptions = buildCorsOptions()
app.use(cors(corsOptions))
```

### Настройки CORS (из ENV):

- `CORS_ORIGINS` - разрешённые источники (через запятую)
- `DISABLE_CORS` - отключить CORS (для тестирования)

## Логирование

### Логирование ошибок:

```typescript
// В production используй pino или winston
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

// В error handler
app.use((err, req, res, next) => {
  logger.error({
    err,
    req: {
      method: req.method,
      url: req.url,
      headers: req.headers
    }
  }, 'Request error')

  res.status(err.status || 500).json({ error: err.message })
})
```

### Логирование запросов:

```typescript
import morgan from 'morgan'

app.use(morgan('combined'))
```

## Безопасность: Best Practices

### ✅ DO:

1. **Всегда хешируй пароли** через BcryptPasswordHasher
2. **Используй HttpOnly cookies** для refresh токенов
3. **Валидируй все входные данные** через zod
4. **Используй helmet** для security headers
5. **Ограничивай запросы** (rate limiting) в production
6. **Логируй ошибки** для мониторинга
7. **Проверяй JWT** на каждом защищённом роуте
8. **Используй HTTPS** в production

### ❌ DON'T:

1. **НЕ храни пароли plain text**
2. **НЕ возвращай sensitive data** (хеши паролей, токены)
3. **НЕ логируй пароли** и токены
4. **НЕ забывай про CORS** в production
5. **НЕ используй слабые JWT secrets** (минимум 32 символа)
6. **НЕ храни JWT в localStorage** (только access в памяти)
7. **НЕ игнорируй ошибки безопасности**

## Пример полного auth домена:

```typescript
import { Router } from 'express'
import { prisma } from '../prisma'
import { JwtTokenService, BcryptPasswordHasher } from '@packages/security'

const jwtService = new JwtTokenService(process.env.JWT_SECRET)
const hasher = new BcryptPasswordHasher()

// Use-case: Register
async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new ValidationError('Email already exists')

  const passwordHash = await hasher.hash(password)

  return await prisma.user.create({
    data: {
      email,
      passwordHash,
      ratingLevel: 3,
      wallet: { create: { balanceMinor: 0, currency: 'RUB' } }
    }
  })
}

// Use-case: Login
async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new UnauthorizedError('Invalid credentials')

  const isValid = await hasher.compare(password, user.passwordHash)
  if (!isValid) throw new UnauthorizedError('Invalid credentials')

  const accessToken = jwtService.sign({ userId: user.id }, '15m')
  const refreshToken = jwtService.sign({ userId: user.id }, '7d')

  return { accessToken, refreshToken, user }
}

// Router
export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const user = await registerUser(req.body.email, req.body.password)
    res.status(201).json({ id: user.id, email: user.email })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUser(req.body.email, req.body.password)

    // Установить refresh cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })
  } catch (err) {
    next(err)
  }
})
```

---

**Следуй этим правилам для безопасного backend!**
