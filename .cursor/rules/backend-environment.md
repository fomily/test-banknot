---
alwaysApply: true
---

# 🔐 Backend: Environment Configuration

Этот файл описывает все переменные окружения, их валидацию и конфигурацию проекта.

## Структура .env файлов

### Корневой `.env.example`
Шаблон с переменными для разработки и продакшена (пример значений, не коммитится).

### Локальные `.env` файлы
Размещаются в конкретных приложениях: `apps/server/.env`

**ВАЖНО:** Реальные `.env` файлы **НЕ коммитятся** в git (добавлены в `.gitignore`).

## Загрузка и валидация

Все переменные окружения загружаются и валидируются через `@packages/config`:

```typescript
import { loadEnv } from '@packages/config'

// В apps/server/src/index.ts
const env = loadEnv()

console.log(env.PORT) // 4000
console.log(env.JWT_SECRET) // ваш секрет
```

Валидация происходит через **zod** - если переменная отсутствует или невалидна, приложение не запустится.

## Обязательные переменные

### NODE_ENV
Окружение приложения: `development`, `test`, `production`

```bash
NODE_ENV=development
```

### JWT_SECRET
Секрет для подписи JWT токенов (минимум 32 символа).

```bash
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
```

**ВАЖНО:** В production используй криптографически стойкий случайный ключ!

```bash
# Генерация секрета
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Серверные переменные

### PORT
Порт сервера (по умолчанию: 4000)

```bash
PORT=4000
```

### DATABASE_URL
URL подключения к PostgreSQL базе данных

```bash
# Development (локально через Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banknot_dev

# Production (managed DB)
DATABASE_URL=postgresql://user:password@db.example.com:5432/banknot_prod
```

### ACCESS_TOKEN_TTL
Время жизни access токена (по умолчанию: 15m)

```bash
ACCESS_TOKEN_TTL=15m
```

Форматы: `15m` (минуты), `1h` (часы), `7d` (дни)

### REFRESH_TOKEN_TTL
Время жизни refresh токена (по умолчанию: 7d)

```bash
REFRESH_TOKEN_TTL=7d
```

## Куки и CORS

### COOKIE_NAME_REFRESH
Имя refresh cookie (по умолчанию: `refreshToken`)

```bash
COOKIE_NAME_REFRESH=refreshToken
```

### COOKIE_PATH_REFRESH
Путь для refresh cookie (по умолчанию: `/auth/refresh`)

```bash
COOKIE_PATH_REFRESH=/auth/refresh
```

### COOKIE_DOMAIN
Домен для cookie (опционально для cross-domain)

```bash
# Development
COOKIE_DOMAIN=localhost

# Production
COOKIE_DOMAIN=.example.com
```

### COOKIE_SECURE
Использовать secure флаг для cookie (`true` в production)

```bash
# Development
COOKIE_SECURE=false

# Production
COOKIE_SECURE=true
```

### COOKIE_SAMESITE
Политика SameSite для cookie: `lax`, `strict`, `none`

```bash
# Development
COOKIE_SAMESITE=lax

# Production (cross-origin)
COOKIE_SAMESITE=none
```

**Важно:** При `sameSite: none` обязателен `secure: true`!

### CORS_ORIGINS
Разрешённые источники для CORS (через запятую)

```bash
# Development
CORS_ORIGINS=http://localhost:5173,http://localhost:5175

# Production
CORS_ORIGINS=https://app.example.com,https://admin.example.com
```

### DISABLE_CORS
Отключить CORS (для тестирования, **не используй в production!**)

```bash
DISABLE_CORS=false
```

## Внешние сервисы

### PROCESSING_API_URL
URL внешнего платежного провайдера

```bash
PROCESSING_API_URL=https://api.payment-provider.com
```

### PROCESSING_API_KEY
API ключ для внешнего платежного провайдера

```bash
PROCESSING_API_KEY=your-api-key-here
```

## Дополнительные переменные

### APP_ENV
Дополнительное указание окружения приложения: `local`, `demo`, `production`

```bash
# Development
APP_ENV=local

# Demo deploy (GitHub Pages)
APP_ENV=demo

# Production
APP_ENV=production
```

Используется для различения окружений (например, demo использует моки вместо реального API).

## Пример полного .env файла

```bash
# Окружение
NODE_ENV=development
APP_ENV=local

# Сервер
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banknot_dev

# JWT
JWT_SECRET=dev-secret-key-change-in-production-32-chars-minimum
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# Cookies
COOKIE_NAME_REFRESH=refreshToken
COOKIE_PATH_REFRESH=/auth/refresh
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5175
DISABLE_CORS=false

# Внешние сервисы (опционально)
# PROCESSING_API_URL=https://api.payment-provider.com
# PROCESSING_API_KEY=your-api-key-here
```

## Использование в коде

### Загрузка ENV:

```typescript
// apps/server/src/index.ts
import { loadEnv } from '@packages/config'

const env = loadEnv()

const app = express()
const port = env.PORT

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

### Использование CORS:

```typescript
// apps/server/src/app.ts
import { buildCorsOptions } from '@packages/config'
import cors from 'cors'

const corsOptions = buildCorsOptions()
app.use(cors(corsOptions))
```

### Использование в JWT:

```typescript
import { JwtTokenService } from '@packages/security'

const jwtService = new JwtTokenService(process.env.JWT_SECRET)

const accessToken = jwtService.sign(
  { userId: user.id },
  process.env.ACCESS_TOKEN_TTL || '15m'
)
```

## Валидация через zod

Все переменные валидируются через zod схему в `@packages/config/src/env.ts`:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  // ... остальные переменные
})

export function loadEnv() {
  return envSchema.parse(process.env)
}
```

Если переменная отсутствует или невалидна - приложение **не запустится** с понятной ошибкой.

## Безопасность ENV

### ✅ DO:

1. **Добавь .env в .gitignore** - не коммить секреты!
2. **Используй .env.example** для документации
3. **Генерируй сложные секреты** (минимум 32 символа)
4. **Валидируй все переменные** через zod
5. **Используй разные секреты** для dev/staging/production
6. **Храни production секреты** в безопасном месте (GitHub Secrets, Vault)

### ❌ DON'T:

1. **НЕ коммить .env файлы** в git
2. **НЕ использовать слабые секреты** в production
3. **НЕ логировать значения ENV** переменных
4. **НЕ share секреты** через незащищённые каналы
5. **НЕ использовать production секреты** в development

## GitHub Secrets (для CI/CD)

В GitHub репозитории добавь секреты через Settings → Secrets:

- `JWT_SECRET` - секрет для JWT
- `DATABASE_URL` - URL продакшн БД
- `COOKIE_DOMAIN` - домен для cookies
- `PROCESSING_API_KEY` - ключ API провайдера

Использование в GitHub Actions:

```yaml
# .github/workflows/deploy.yml
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  NODE_ENV: production
```

## Troubleshooting

### Ошибка: "JWT_SECRET must be at least 32 characters"
➡️ Увеличь длину JWT_SECRET в .env файле

### Ошибка: "DATABASE_URL is required"
➡️ Добавь DATABASE_URL в apps/server/.env

### Ошибка: "Invalid NODE_ENV value"
➡️ Используй только: development, test, production

### CORS ошибка в production
➡️ Проверь CORS_ORIGINS - должны быть реальные домены с https://

---

**Следуй этим правилам для правильной конфигурации окружения!**

