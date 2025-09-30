# Banknot Monorepo

## Step 0: локальная БД, Prisma и базовые проверки

### Предварительные требования
- Docker Desktop
- Node.js 20+

### Окружение
- Создайте файл `apps/server/.env` по образцу:

```
NODE_ENV=development
PORT=4000
COOKIE_DOMAIN=localhost
DATABASE_URL=postgresql://banknot:banknot@localhost:5432/banknot?schema=public
JWT_SECRET=change-me-in-local
```

### БД (Docker Compose)
- Запуск: `npm run db:up`
- Остановка: `npm run db:down`
- Полный ресет: `npm run db:reset`
- Adminer: http://localhost:8080 (сервер: db, user: banknot, password: banknot, db: banknot)

### Prisma
- Генерация клиента: `npm run -w @apps/server prisma:generate`
- Миграции: `npm run db:migrate`
- Сиды: `npm run db:seed`

Dev-аккаунты (только локально):
- admin@example.com / DEV_PASSWORD_admin123
- user@example.com / DEV_PASSWORD_user123

### Сервер
- Dev: `npm run dev:server`
- Health-check: `GET http://localhost:4000/health`
- Docs (плейсхолдер): `http://localhost:4000/docs`

### Клиент/Админка
- Сборка клиента: `npm run -w @apps/client build`
- Dev клиента: `npm run dev:client`
- Dev админки: `npm run dev:admin`

### CI
- Простой workflow в `.github/workflows/ci.yml` собирает все пакеты на push в `main` и на PR.
- Демо деплой клиента: по тегам `demo-*` (см. `.cursor/rules/deployment.mdc`).


### Environment variables (root .env)

Используйте единый корневой `.env` со следующими переменными:

```
NODE_ENV=development
PORT=4000

# Auth tokens
JWT_SECRET=change_me_dev_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# Cookies
COOKIE_NAME_REFRESH=refreshToken
COOKIE_PATH_REFRESH=/auth/refresh
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
DISABLE_CORS=
```


