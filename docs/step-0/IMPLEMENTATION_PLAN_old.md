# План реализации проекта Banknot

> **Связь с требованиями**: Все этапы реализуют функционал из [REQUIREMENTS.md](REQUIREMENTS.md)

## Легенда статусов

- **⏳** В работе
- **✅** Выполнено
- **📋** Запланировано
- **⏸️** Заблокировано (ожидает завершения других этапов)
- **❌** Отменено

## Прогресс реализации

```
[▓▓▓▓▓▓▓░░░░░] 58% (7/12 этапов)
```

---

## Этап 0: Подготовка инфраструктуры ✅

**Описание:** Настройка локального окружения разработки, базы данных, Docker Compose, скрипты для работы с БД.

**Требования:** REQUIREMENTS.md - все разделы (базовая инфраструктура)

### Критерии готовности:
- [x] Репозиторий и ветки настроены
- [x] GitHub Actions: простой `ci.yml` на `push: main` и `pull_request` (build всех workspaces)
- [x] Публикация клиента по тегам `demo-*` (GitHub Pages)
- [x] Секреты/vars репозитория: `JWT_SECRET`, `COOKIE_DOMAIN`, `NODE_ENV`
- [x] Шаблоны окружения: `.env.example` в корне и для `apps/server`
- [x] Docker Compose: `postgres:16` + `adminer`, именованный volume, порт 5432
- [x] Скрипты npm: `db:up`, `db:down`, `db:reset`, `db:migrate`, `db:seed`, `dev:server`, `dev:client`, `dev:admin`
- [x] Prisma: расположение `apps/server/prisma`, `schema.prisma`, миграции, seed
- [x] Seed (идемпотентно): админ + пользователь с фиксированными паролями, продукты, кошельки, транзакции
- [x] Проверка: контейнер Postgres запущен, миграции/сиды проходят, сервер поднимается
- [x] `/health` → 200
- [x] `/docs` открывается (плейсхолдер Swagger)

### Проверка после завершения:
```bash
# Должно работать:
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev:server
curl http://localhost:4000/health  # → 200
```

---

## Этап 1: Инфраструктура сервера ✅

**Описание:** Базовая настройка Express сервера, middleware, error handler, health-check.

**Требования:** REQUIREMENTS.md §2.1 (аутентификация - подготовка)

### Критерии готовности:
- [x] Скелет `apps/server`: Express, CORS, cookies, JSON, helmet, rate-limit
- [x] Error middleware (централизованная обработка ошибок)
- [x] Health-check эндпоинт `/health`
- [x] Пакеты `@packages/config` и `@packages/security` подключены
- [x] Линтеры и сборка работают
- [x] Базовые middlewares настроены

### Проверка после завершения:
```bash
npm run dev:server
curl http://localhost:4000/health  # → {"status":"ok","timestamp":"..."}
```

---

## Этап 2: Модели и миграции (Prisma) ✅

**Описание:** Создание всех моделей данных, миграций, индексов, enum'ов.

**Требования:** REQUIREMENTS.md §3 (Модели данных)

### Критерии готовности:
- [x] Модели описаны: `User`, `Wallet`, `Transaction`, `Product`, `UserProducts`
- [x] Enum'ы: `Transaction.direction`, `Transaction.status`, `Transaction.category`, `Transaction.source`, `Product.category`
- [x] Индексы: `UserProducts(userId, productId)` - уникальный; `Transaction(userId, createdAt)` - индекс
- [x] Политика FK: каскадное удаление (`User` → `Wallet`, `Transaction`, `UserProducts`; `Product` → `UserProducts`)
- [x] Миграции применены
- [x] Сиды: полный набор продуктов, `allowedRatings`, админ, тест-пользователь, кошельки, транзакции

### Проверка после завершения:
```bash
npm run db:reset  # Должно пройти без ошибок
# Проверить через Adminer:
# - Таблицы созданы
# - Enum'ы присутствуют
# - Индексы на месте
# - Сид-данные загружены
```

---

## Этап 3: Аутентификация (JWT) ✅

**Описание:** Реализация регистрации, логина, refresh токенов, logout.

**Требования:** REQUIREMENTS.md §2.1, §2.2

### Критерии готовности:
- [x] Use-cases: `registerUser`, `loginUser`, `refreshTokenUseCase`, `logoutUser`
- [x] Эндпоинты: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- [x] Refresh токен в HttpOnly cookie, access токен в ответе
- [x] При регистрации: создание `User` с `ratingLevel=3`, создание `Wallet` с `balanceMinor=0`
- [x] Хеширование паролей через BcryptPasswordHasher
- [x] Валидация через zod

### Проверка после завершения:
```bash
# Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# → 201, { id, email, ratingLevel: 3 }

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
# → 200, { accessToken: "..." }
# Cookie "refreshToken" установлен

# Refresh
curl -X POST http://localhost:4000/auth/refresh -b cookies.txt
# → 200, { accessToken: "..." }

# Logout
curl -X POST http://localhost:4000/auth/logout -b cookies.txt
# → 200, { message: "..." }
# Cookie "refreshToken" очищен
```

---

## Этап 4: VPS-развертывание (single-node) 📋

**Описание:** Настройка VPS, reverse-proxy, managed PostgreSQL, CD через GitHub Actions.

**Требования:** Техническая инфраструктура (не бизнес-требования)

### Критерии готовности:
- [ ] VPS настроен (Hetzner/DigitalOcean/AWS, Ubuntu 22.04 LTS)
- [ ] Базовая настройка: пользователи, SSH-ключи, обновления, timezone, `ufw` (22, 80, 443)
- [ ] Docker/Compose установлены
- [ ] Reverse-proxy (Caddy/Nginx) с автоматическим HTTPS (Let's Encrypt)
- [ ] Домены: A-запись на поддомен, сертификаты выпущены
- [ ] База данных: managed Postgres (или контейнер с бэкапами)
- [ ] Переменные окружения: `DATABASE_URL`, `JWT_SECRET`, `COOKIE_DOMAIN`, `NODE_ENV=production`, `PORT`
- [ ] CD: GitHub Actions на push в `main`:
  - Сборка Docker-образа `apps/server`, пуш в GHCR
  - SSH-deploy на VPS или `docker compose pull && up -d`
  - Миграции: `prisma migrate deploy` + `prisma generate`
- [ ] Логи/мониторинг: `docker logs`, health-check
- [ ] Резервирование: crontab для `pg_dump` (если self-hosted DB)

### Проверка после завершения:
```bash
# Сервер доступен по HTTPS:
curl https://api.example.com/health
# → 200, {"status":"ok"}

# Swagger UI доступен:
curl https://api.example.com/docs
# → 200, HTML

# CD работает:
git push origin main
# → GitHub Actions запускается, деплой проходит успешно
```

---

## Этап 5: Пользователь и профиль ✅

**Описание:** Эндпоинты для получения профиля и обновления ФИО.

**Требования:** REQUIREMENTS.md §2.7

### Критерии готовности:
- [x] Use-cases: `GetMe`, `UpdatePassportData`
- [x] Эндпоинты: `GET /users/me`, `PATCH /users/me/profile`
- [x] Auth middleware для защиты роутов
- [x] Клиент: главный экран берет рейтинг и баланс с бэкенда
- [x] Клиент: профиль показывает ФИО/рейтинг, пункт «Выйти»
- [x] Валидация ФИО (минимум 2 символа, не пустые)

### Проверка после завершения:
```bash
# GET /users/me
curl http://localhost:4000/users/me \
  -H "Authorization: Bearer <accessToken>"
# → 200, { id, email, firstName, lastName, middleName, avatarUrl, ratingLevel, isAdmin, createdAt, wallet: { balance } }
# ✅ ПРОВЕРЕНО: Возвращает полные данные пользователя с кошельком
# ✅ ПРОВЕРЕНО: Поле avatarUrl добавлено в модель User (миграция 20251002125202_add_avatar_url)

# PATCH /users/me/profile
curl -X PATCH http://localhost:4000/users/me/profile \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Иван","lastName":"Петров","middleName":"Сергеевич"}'
# → 200, { id, email, firstName: "Иван", lastName: "Петров", middleName: "Сергеевич", ... }
# ✅ ПРОВЕРЕНО: Обновление ФИО работает корректно

# Клиент: главный экран показывает баланс и рейтинг с бэкенда
# ✅ ПРОВЕРЕНО: Рейтинг "хороший" (level 3) отображается

# Клиент: профиль показывает ФИО, кнопка "Выйти" работает
# ✅ ПРОВЕРЕНО: Профиль отображает "Петров Иван Сергеевич", рейтинг "хороший"
# ✅ ПРОВЕРЕНО: Кнопка "Выйти" работает, возвращает на экран авторизации
# ✅ ПРОВЕРЕНО: Аватар пользователя отображается в меню и профиле (если avatarUrl задан)
```

---

## Этап 6: Продукты 📋

**Описание:** Эндпоинт для получения всех продуктов с флагом доступности.

**Требования:** REQUIREMENTS.md §2.4

### Критерии готовности:
- [ ] Use-case: `ListProductsWithAvailabilityForUser`
- [ ] Эндпоинт: `GET /products` → все продукты с `isEnabled` (по `allowedRatings`)
- [ ] `isEnabled = allowedRatings.includes(user.ratingLevel)`
- [ ] Клиент: экран «Продукты» отображает disabled карточки (как «Ипотека» сейчас)

### Проверка после завершения:
```bash
# GET /products
curl http://localhost:4000/products \
  -H "Authorization: Bearer <accessToken>"
# → 200, { items: [ { id, code, name, description, category, icon, isEnabled }, ... ] }

# Для пользователя с ratingLevel=3:
# - Накопительный счёт: isEnabled=true (allowedRatings: [3,4,5])
# - Ипотека: isEnabled=false (allowedRatings: [5])

# Клиент: недоступные продукты серые/disabled
```

---

## Этап 7: Открытие «Накопительный счёт» 📋

**Описание:** Открытие продукта с проверкой рейтинга, баланса, списанием средств.

**Требования:** REQUIREMENTS.md §2.5, §4.3

### Критерии готовности:
- [ ] Use-case: `OpenSavingsAccount`
  - Проверка доступности по рейтингу
  - Проверка уникальности (`userId + productId`)
  - Если `initialDeposit > 0`:
    - Проверка достаточности баланса
    - Списание с кошелька
    - Создание транзакции (DEBIT)
  - Создание записи в `UserProducts`
- [ ] Эндпоинт: `POST /products/open` { code, initialDeposit }
- [ ] Клиент: экран с суммой (0 по умолчанию), «Открыть», сообщение об успехе
- [ ] Клиент: продукт появляется в «Мои продукты»

### Проверка после завершения:
```bash
# POST /products/open (с initialDeposit=0)
curl -X POST http://localhost:4000/products/open \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVINGS","initialDeposit":0}'
# → 201, { id, productId, productName, initialDeposit: 0, status: "ACTIVE", openedAt }

# POST /products/open (с initialDeposit=100000)
# Предварительно: пополнить баланс (через админку)
curl -X POST http://localhost:4000/products/open \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVINGS","initialDeposit":100000}'
# → 201, { ... }
# Баланс уменьшился на 100000
# Создана транзакция DEBIT

# GET /users/me/products
curl http://localhost:4000/users/me/products \
  -H "Authorization: Bearer <accessToken>"
# → 200, { items: [ { id, productId, productName: "Накопительный счёт", ... } ] }

# Клиент: «Мои продукты» показывает открытый счёт
```

---

## Этап 8: Транзакции 📋

**Описание:** Просмотр транзакций пользователя, создание транзакций из админки.

**Требования:** REQUIREMENTS.md §2.9

### Критерии готовности:
- [ ] Use-cases: `ListUserTransactions`, `AdminCreateTransaction`
- [ ] Эндпоинты:
  - `GET /users/me/transactions?limit&cursor` - список транзакций пользователя
  - `POST /admin/users/:id/transactions` - создание транзакции из админки
- [ ] Пагинация: cursor-based
- [ ] Клиент: экран кошелька с транзакциями, подгрузка при скролле
- [ ] Админка: просмотр и создание транзакций для пользователя

### Проверка после завершения:
```bash
# GET /users/me/transactions
curl "http://localhost:4000/users/me/transactions?limit=20" \
  -H "Authorization: Bearer <accessToken>"
# → 200, { items: [ { id, direction, amountMinor, currency, category, counterpartyName, status, postedAt, createdAt } ], nextCursor }

# POST /admin/users/:id/transactions (admin only)
curl -X POST http://localhost:4000/admin/users/USER_ID/transactions \
  -H "Authorization: Bearer <adminAccessToken>" \
  -H "Content-Type: application/json" \
  -d '{"direction":"CREDIT","amountMinor":500000,"currency":"RUB","category":"TRANSFER","counterpartyName":"Тест Тестович"}'
# → 201, { id, direction: "CREDIT", amountMinor: 500000, status: "POSTED", ... }
# Баланс пользователя увеличился на 500000
# source=ADMIN, status=POSTED, postedAt=now

# Клиент: пользователь видит новую транзакцию в кошельке
```

---

## Этап 9: Админка (apps/admin) 📋

**Описание:** UI для управления пользователями, транзакциями, продуктами.

**Требования:** REQUIREMENTS.md §2.10

### Критерии готовности:
- [ ] Эндпоинты:
  - `GET /admin/users` - список пользователей
  - `POST /admin/users` - создание пользователя
  - `PATCH /admin/users/:id` - редактирование (email, ФИО, роль)
  - `PATCH /admin/users/:id/rating` - изменение рейтинга
  - `GET /admin/users/:id/transactions` - транзакции пользователя
  - `POST /admin/users/:id/transactions` - создание транзакции
  - `GET /admin/products` - список продуктов
  - `PATCH /admin/products/:id` - редактирование продукта
  - `PATCH /admin/products/:id/access` - изменение `allowedRatings`
- [ ] Middleware: `adminMiddleware` (проверка роли ADMIN)
- [ ] Клиент (admin): UI для всех операций
- [ ] Авторизация через `/auth/login` с проверкой роли

### Проверка после завершения:
```bash
# Login as admin
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c admin-cookies.txt
# → 200, { accessToken }

# GET /admin/users
curl http://localhost:4000/admin/users \
  -H "Authorization: Bearer <adminAccessToken>"
# → 200, { items: [ { id, email, firstName, lastName, ratingLevel, role, createdAt } ] }

# PATCH /admin/users/:id/rating
curl -X PATCH http://localhost:4000/admin/users/USER_ID/rating \
  -H "Authorization: Bearer <adminAccessToken>" \
  -H "Content-Type: application/json" \
  -d '{"ratingLevel":5}'
# → 200, { id, ratingLevel: 5, ... }

# PATCH /admin/products/:id/access
curl -X PATCH http://localhost:4000/admin/products/PRODUCT_ID/access \
  -H "Authorization: Bearer <adminAccessToken>" \
  -H "Content-Type: application/json" \
  -d '{"allowedRatings":[3,4,5]}'
# → 200, { id, allowedRatings: [3,4,5], ... }

# Админка: UI работает для всех операций
```

---

## Этап 10: Документация и качество 📋

**Описание:** OpenAPI документация, unit-тесты, линтеры, логирование.

**Требования:** Техническое качество (не бизнес-требования)

### Критерии готовности:
- [ ] Генерация OpenAPI из `zod` схем (`zod-to-openapi`)
- [ ] Swagger UI на `/docs` актуален и синхронизирован
- [ ] Unit-тесты: use-cases ключевых доменов
- [ ] Интеграционные тесты: API эндпоинты (supertest)
- [ ] Линтеры/prettier настроены и проходят
- [ ] Логирование (pino): структурированные логи, уровни
- [ ] Обработка ошибок: типизированные ошибки (ValidationError, NotFoundError, etc.)
- [ ] Валидация: все входы/выходы через zod

### Проверка после завершения:
```bash
# Swagger UI доступен
curl http://localhost:4000/docs
# → 200, HTML со Swagger UI

# Все схемы в /docs соответствуют zod
# Request/Response schemas валидируются

# Тесты проходят
npm run test
# → All tests passed

# Линтеры проходят
npm run lint
# → No errors

# Логи структурированы
npm run dev:server
# → JSON логи с уровнями (info, warn, error)
```

---

## Этап 11: Безопасность и будущее 📋

**Описание:** Финальная проверка безопасности, заглушки для SMTP и внешнего провайдера.

**Требования:** REQUIREMENTS.md §6 (Ограничения и будущие расширения)

### Критерии готовности:
- [ ] Хеширование паролей (bcrypt, cost=10)
- [ ] Обновление токенов работает корректно
- [ ] Блок-лист токенов (опционально, если требуется)
- [ ] SMTP: интерфейс и заглушка определены
- [ ] Внешний провайдер переводов: интерфейс и заглушка определены
- [ ] Rate limiting включен в production
- [ ] Helmet включен с корректными настройками
- [ ] CORS настроен для production

### Проверка после завершения:
```bash
# Пароли хешируются (проверить в БД - нет plain text)
# Rate limiting работает (попытка превысить лимит → 429)
# Helmet headers присутствуют (проверить через curl -I)
# CORS корректен (проверить через браузер/curl)
# Интерфейсы SMTP/провайдера подключены как заглушки
```

---

## Этап 11.5: Загрузка и хранение аватаров (будущее) 📋

**Описание:** Реализация загрузки файлов аватаров пользователей с интеграцией внешнего хранилища.

**Требования:** Техническая функциональность (не входит в текущий MVP)

### Критерии готовности:
- [ ] Интеграция с внешним хранилищем (Cloudinary / AWS S3 / Supabase Storage)
- [ ] Эндпоинт: `POST /users/me/avatar` - загрузка аватара
- [ ] Эндпоинт: `DELETE /users/me/avatar` - удаление аватара
- [ ] Валидация файлов:
  - Только изображения (JPEG, PNG, WebP)
  - Максимальный размер: 5 MB
  - Автоматическое изменение размера до 256x256px
- [ ] Клиент: UI для загрузки аватара в профиле
- [ ] Клиент: Превью перед загрузкой
- [ ] Удаление старого аватара при загрузке нового
- [ ] Безопасность: проверка MIME-типа, защита от вредоносных файлов

### Варианты реализации:

**Вариант A: Cloudinary (рекомендуется):**
- Автоматическая оптимизация изображений
- CDN из коробки
- Бесплатный тариф: 25 GB хранилища, 25 GB bandwidth/месяц
- SDK для Node.js с простым API

**Вариант B: AWS S3 + CloudFront:**
- Больше контроля над настройками
- Требует больше настройки (bucket policy, CORS, CDN)
- Pre-signed URLs для загрузки напрямую с фронтенда

**Вариант C: Supabase Storage:**
- Простая интеграция
- Автоматическая трансформация изображений
- Row-level security

### Проверка после завершения:
```bash
# POST /users/me/avatar (multipart/form-data)
curl -X POST http://localhost:4000/users/me/avatar \
  -H "Authorization: Bearer <accessToken>" \
  -F "avatar=@/path/to/image.jpg"
# → 200, { avatarUrl: "https://cdn.example.com/avatars/user123.jpg" }

# GET /users/me
curl http://localhost:4000/users/me \
  -H "Authorization: Bearer <accessToken>"
# → 200, { ..., avatarUrl: "https://cdn.example.com/avatars/user123.jpg" }

# DELETE /users/me/avatar
curl -X DELETE http://localhost:4000/users/me/avatar \
  -H "Authorization: Bearer <accessToken>"
# → 200, { avatarUrl: null }

# Клиент: кнопка "Изменить фото" в профиле
# Клиент: аватар отображается в меню и профиле
```

---

## Этап 12: Инфраструктура staging/production 📋

**Описание:** Контейнеризация, staging/production окружения, полный CD pipeline.

**Требования:** Техническая инфраструктура (не бизнес-требования)

### Критерии готовности:
- [ ] Dockerfile для `apps/server` (multi-stage build)
- [ ] .dockerignore настроен
- [ ] Staging: деплой контейнера (Render/Railway/VPS)
- [ ] Staging: переменные окружения настроены
- [ ] Production: аналогично staging
- [ ] Production: секреты в GitHub Environments, ограничение доступа
- [ ] GitHub Actions CD: `deploy-staging.yml` на push в `main`
- [ ] Миграции: `prisma migrate deploy` в CD pipeline
- [ ] Health-check и логи настроены
- [ ] Мониторинг/алерты (по возможности)

### Проверка после завершения:
```bash
# Staging доступен по https:
curl https://staging-api.example.com/health
# → 200

# Production доступен по https:
curl https://api.example.com/health
# → 200

# CD работает:
git push origin main
# → GitHub Actions: staging деплой → успех

# Миграции применяются автоматически
# Логи поступают (docker logs / облачный провайдер)
```

---

## Критерии полной готовности проекта

### Функциональность
- [ ] Регистрация/логин/рефреш/логаут работают
- [ ] Кошелёк создаётся при регистрации (0 ₽, ratingLevel=3)
- [ ] Главный экран: рейтинг и баланс с бэкенда
- [ ] Главный экран: «Мои продукты» с бэкенда, скрытие при пустых данных
- [ ] Продукты: приходят с `isEnabled`, disabled корректно отображаются
- [ ] Открытие «Накопительный счёт»: создаёт запись, транзакцию (при взносе), продукт виден в «Моих продуктах»
- [ ] Рейтинг-экран: полоса соответствует `ratingLevel`
- [ ] Профиль: ФИО/рейтинг с бэкенда, изменение ФИО, пункт «Выйти» работает
- [ ] Кошелёк: транзакции с бэкенда, админские операции видны как обычные

### Админка
- [ ] Пользователи: список, создание, редактирование (ФИО, email, рейтинг, роль)
- [ ] Транзакции: просмотр списка, создание для пользователя
- [ ] Продукты: список, редактирование, настройка `allowedRatings`

### Документация и качество
- [ ] Swagger UI `/docs` актуален
- [ ] Тесты проходят (unit + integration)
- [ ] Линтеры/prettier без ошибок
- [ ] Логирование настроено

### Безопасность
- [ ] Пароли хешируются
- [ ] JWT токены безопасны (HttpOnly cookie для refresh)
- [ ] Rate limiting включен в production
- [ ] Helmet настроен
- [ ] CORS корректен

### Инфраструктура
- [ ] Локальная разработка: все команды работают
- [ ] VPS развёрнут (или аналог)
- [ ] Staging/Production деплой работает
- [ ] CD pipeline функционирует
- [ ] Health-check и логи доступны

---

## Обновление плана

**Как обновлять этот документ:**

1. **После завершения задачи**: отметить чекбокс `[x]`, изменить статус этапа на ✅
2. **При начале работы**: изменить статус на ⏳
3. **При блокировке**: изменить статус на ⏸️, указать причину
4. **При отмене**: изменить статус на ❌, указать причину
5. **При добавлении нового этапа**: вставить в нужное место с 📋

**Обновление прогресса:**
```
Текущий прогресс = (количество ✅) / (общее количество этапов) * 100%
```

---

**Следи за актуальностью плана! После каждой завершённой задачи обновляй чекбоксы.**

