---
applyContext: api
---

# 📋 API Contracts и документация

Этот файл описывает API контракты, OpenAPI документацию и правила работы с zod schemas.

## OpenAPI Documentation

Проект использует **OpenAPI 3.1** для документации API.

### Swagger UI доступен на `/docs`

```
http://localhost:4000/docs
```

### Генерация спецификации

Спецификация генерируется автоматически из **zod схем** с помощью `zod-to-openapi`.

```typescript
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

// Схема с OpenAPI метаданными
const registerSchema = z.object({
  email: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().min(8).openapi({ example: 'password123' })
}).openapi('RegisterRequest')
```

## Zod Schemas

Все API эндпоинты используют **zod** для валидации запросов и ответов.

### Определение схем:

```typescript
import { z } from 'zod'

// Request schema
export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// Response schema
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  ratingLevel: z.number().min(1).max(5),
  createdAt: z.string().datetime()
})

// TypeScript types из схем
export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
```

### Использование в роутах:

```typescript
authRouter.post('/register', async (req, res, next) => {
  try {
    // Валидация запроса
    const validated = registerRequestSchema.parse(req.body)

    // Use-case
    const user = await registerUser(validated)

    // Валидация ответа
    const response = userResponseSchema.parse(user)

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
})
```

## API Endpoints

### Auth

#### POST /auth/register
Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "ratingLevel": 3
}
```

#### POST /auth/login
Вход в систему.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbG..."
}
```

**Cookie:** `refreshToken` (HttpOnly, Secure)

#### POST /auth/refresh
Обновление токенов.

**Cookie:** `refreshToken` (required)

**Response (200):**
```json
{
  "accessToken": "eyJhbG..."
}
```

#### POST /auth/logout
Выход из системы (очистка refresh cookie).

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Users

#### GET /users/me
Получение профиля текущего пользователя.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "middleName": "Петрович",
  "ratingLevel": 3,
  "role": "USER"
}
```

#### PATCH /users/me/profile
Обновление профиля (ФИО).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "middleName": "Петрович"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "middleName": "Петрович"
}
```

#### GET /users/me/wallet
Получение баланса кошелька.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "balanceMinor": 100000,
  "currency": "RUB"
}
```

#### GET /users/me/transactions
Получение списка транзакций (с пагинацией).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query params:**
- `limit` (number, default: 20)
- `cursor` (string, optional)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "direction": "DEBIT",
      "amountMinor": 50000,
      "currency": "RUB",
      "category": "TRANSFER",
      "counterpartyName": "Иван Иванов",
      "status": "POSTED",
      "postedAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "nextCursor": "cursor-string"
}
```

#### GET /users/me/products
Получение активных продуктов пользователя.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Накопительный счёт",
      "productCode": "SAVINGS",
      "initialDeposit": 100000,
      "status": "ACTIVE",
      "openedAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### Products

#### GET /products
Получение всех продуктов с флагом доступности.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "code": "SAVINGS",
      "name": "Накопительный счёт",
      "description": "До 10% годовых",
      "category": "SAVING",
      "icon": "savings",
      "isEnabled": true
    },
    {
      "id": "uuid",
      "code": "MORTGAGE",
      "name": "Ипотека",
      "description": "От 5% годовых",
      "category": "CREDIT",
      "icon": "home",
      "isEnabled": false
    }
  ]
}
```

**Примечание:** `isEnabled` вычисляется на основе `allowedRatings` и рейтинга пользователя.

#### POST /products/open
Открытие продукта (например, накопительного счёта).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request:**
```json
{
  "code": "SAVINGS",
  "initialDeposit": 100000
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "productName": "Накопительный счёт",
  "initialDeposit": 100000,
  "status": "ACTIVE",
  "openedAt": "2025-01-15T10:00:00Z"
}
```

### Admin

#### GET /admin/users
Получение списка пользователей (только для админа).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "ratingLevel": 3,
      "role": "USER",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /admin/users
Создание нового пользователя (только для админа).

#### PATCH /admin/users/:id
Обновление пользователя (только для админа).

#### PATCH /admin/users/:id/rating
Изменение рейтинга пользователя.

**Request:**
```json
{
  "ratingLevel": 5
}
```

#### GET /admin/users/:id/transactions
Получение транзакций пользователя.

#### POST /admin/users/:id/transactions
Создание транзакции для пользователя.

**Request:**
```json
{
  "direction": "CREDIT",
  "amountMinor": 50000,
  "currency": "RUB",
  "category": "TRANSFER",
  "counterpartyName": "Тест Тестович"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "direction": "CREDIT",
  "amountMinor": 50000,
  "status": "POSTED",
  "postedAt": "2025-01-15T10:00:00Z"
}
```

#### GET /admin/products
Получение всех продуктов.

#### PATCH /admin/products/:id/access
Изменение доступности продукта (allowedRatings).

**Request:**
```json
{
  "allowedRatings": [3, 4, 5]
}
```

## Response Formats

### Success Response

```json
{
  "data": { ... }
}
```

Или просто объект/массив (без обёртки).

### Error Response

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

### HTTP Status Codes

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан
- `400 Bad Request` - Ошибка валидации
- `401 Unauthorized` - Не авторизован
- `403 Forbidden` - Нет прав доступа
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Ошибка сервера

## Validation Rules

### Email
- Валидный email формат
- Уникальный при регистрации

### Password
- Минимум 8 символов
- Хешируется через bcrypt

### RatingLevel
- Целое число от 1 до 5

### AmountMinor
- Положительное целое число
- В минорных единицах (копейки для RUB)

### Currency
- Трёхбуквенный код (ISO 4217)
- Сейчас только "RUB"

## Типы данных

### Enums

**Transaction Direction:**
- `CREDIT` - Зачисление
- `DEBIT` - Списание

**Transaction Status:**
- `POSTED` - Проведена
- `PENDING` - В обработке
- `FAILED` - Ошибка
- `CANCELED` - Отменена

**Transaction Category:**
- `TRANSFER` - Перевод
- `TOPUP` - Пополнение
- `TAXI` - Такси
- `FOOD` - Еда
- `EDUCATION` - Образование
- `TRANSPORT` - Транспорт
- `SHOPPING` - Покупки
- `ENTERTAINMENT` - Развлечения
- `OTHER` - Прочее

**Transaction Source:**
- `INTERNAL` - Внутренняя операция
- `ADMIN` - Создано админом
- `STUB` - Заглушка (для будущих интеграций)

**Product Category:**
- `SAVING` - Накопительный
- `CREDIT` - Кредитный

**User Role:**
- `USER` - Пользователь
- `ADMIN` - Администратор

## DTO Schemas (в @api package)

Определи DTO в `packages/api/src/dtos/`:

```typescript
// packages/api/src/dtos/auth.ts
export interface RegisterRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}
```

## TypeScript Types из Prisma

Используй Prisma типы для моделей:

```typescript
import { User, Transaction, Product } from '@prisma/client'

type UserWithWallet = User & { wallet: Wallet }
```

## Best Practices

### ✅ DO:

1. **Валидируй все входные данные** через zod
2. **Генерируй OpenAPI из zod** схем
3. **Экспортируй типы** из zod схем (`z.infer`)
4. **Используй minorные единицы** для денежных сумм
5. **Используй ISO 8601** для дат
6. **Используй UUID** для ID
7. **Документируй эндпоинты** в OpenAPI

### ❌ DON'T:

1. **НЕ используй plain numbers** для денег
2. **НЕ возвращай sensitive data** (пароли, хеши)
3. **НЕ забывай про пагинацию** для списков
4. **НЕ игнорируй ошибки валидации**

---

**Следуй этим правилам для консистентного API!**
