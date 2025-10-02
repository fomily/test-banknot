---
applyContext: backend
---

# 🗄️ Backend: Модели данных

Этот файл описывает структуру моделей БД, схемы Prisma, индексы и правила работы с данными.

## Принципы работы с данными

### Минорные единицы (Minor Units)

**КРИТИЧЕСКИ ВАЖНО:** Все денежные суммы хранятся и передаются в **минорных единицах**.

- **RUB**: 1 рубль = 100 копеек
- Примеры:
  - 1000 ₽ = 100000 минорных единиц
  - 50.50 ₽ = 5050 минорных единиц
  - 0.01 ₽ = 1 минорная единица

**Поля с минорными единицами:**
- `Wallet.balanceMinor` - баланс кошелька
- `Transaction.amountMinor` - сумма транзакции
- `UserProducts.initialDeposit` - первоначальный взнос

### UUID для ID

Все первичные ключи используют **UUID v4** для уникальности и безопасности.

### Временные метки

Все модели содержат:
- `createdAt: DateTime` - дата/время создания
- `updatedAt: DateTime` - дата/время последнего обновления

## Модели данных

### User (Пользователь)

Основная модель пользователя системы.

```typescript
{
  id: string (UUID)
  email: string (unique)
  passwordHash: string
  firstName: string?
  lastName: string?
  middleName: string?
  avatarUrl: string?
  ratingLevel: number (1-5, default: 3)
  role: 'USER' | 'ADMIN' (default: 'USER')
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Связи:**
- `wallet: Wallet` (1:1) - один кошелёк на пользователя
- `transactions: Transaction[]` (1:n) - история транзакций
- `userProducts: UserProducts[]` (1:n) - открытые продукты

**Индексы:**
- `email` - unique index (для быстрого поиска и уникальности)

**Правила:**
- Email должен быть уникальным
- Password хранится только в виде bcrypt хеша
- ФИО опциональны, но если заполнены - минимум 2 символа
- `ratingLevel` от 1 до 5, по умолчанию 3 (средний)
- `role` определяет уровень доступа (USER или ADMIN)

**Prisma схема:**
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  middleName    String?
  avatarUrl     String?
  ratingLevel   Int       @default(3)
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  wallet        Wallet?
  transactions  Transaction[]
  userProducts  UserProducts[]
}

enum UserRole {
  USER
  ADMIN
}
```

---

### Wallet (Кошелёк)

Кошелёк пользователя для хранения баланса.

```typescript
{
  id: string (UUID)
  userId: string (unique, FK)
  balanceMinor: number (default: 0)
  currency: string (default: 'RUB')
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Связи:**
- `user: User` (n:1) - владелец кошелька

**Индексы:**
- `userId` - unique index (один кошелёк на пользователя)

**Правила:**
- Баланс хранится в **минорных единицах** (копейки для RUB)
- Баланс НЕ может быть отрицательным
- При создании пользователя автоматически создаётся кошелёк с балансом 0
- Валюта по умолчанию: RUB (другие валюты на будущее)

**Prisma схема:**
```prisma
model Wallet {
  id           String   @id @default(uuid())
  userId       String   @unique
  balanceMinor Int      @default(0)
  currency     String   @default("RUB")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

### Transaction (Транзакция)

Транзакции пользователя (зачисления и списания).

```typescript
{
  id: string (UUID)
  userId: string (FK)
  direction: 'CREDIT' | 'DEBIT'
  amountMinor: number
  currency: string (default: 'RUB')
  category: TransactionCategory
  counterpartyName: string?
  status: 'POSTED' | 'PENDING' | 'FAILED' | 'CANCELED' (default: 'POSTED')
  source: 'INTERNAL' | 'ADMIN' | 'STUB' (default: 'INTERNAL')
  idempotencyKey: string? (unique)
  postedAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Связи:**
- `user: User` (n:1) - владелец транзакции

**Индексы:**
- `(userId, createdAt)` - composite index для быстрой пагинации ленты транзакций
- `idempotencyKey` - unique index (опционально, для предотвращения дубликатов)

**Direction (Направление):**
- `CREDIT` - Зачисление (входящий перевод, пополнение)
- `DEBIT` - Списание (исходящий перевод, покупка)

**Status (Статус):**
- `POSTED` - Проведена (завершена, баланс обновлён)
- `PENDING` - В обработке (баланс ещё не обновлён)
- `FAILED` - Ошибка (транзакция отклонена)
- `CANCELED` - Отменена (отменена пользователем или системой)

**Source (Источник):**
- `INTERNAL` - Внутренняя операция приложения
- `ADMIN` - Создано администратором через админку
- `STUB` - Заглушка для будущих интеграций

**Category (Категория):**
- `TRANSFER` - Перевод
- `TOPUP` - Пополнение
- `TAXI` - Такси
- `FOOD` - Еда
- `EDUCATION` - Образование
- `TRANSPORT` - Транспорт
- `SHOPPING` - Покупки
- `ENTERTAINMENT` - Развлечения
- `OTHER` - Прочее

**Правила:**
- Транзакции **неизменяемы** после создания
- Сумма всегда в **минорных единицах**
- `idempotencyKey` используется для предотвращения дубликатов
- При создании с `status=POSTED` баланс обновляется атомарно в транзакции БД
- `postedAt` заполняется автоматически при `status=POSTED`

**Prisma схема:**
```prisma
model Transaction {
  id               String              @id @default(uuid())
  userId           String
  direction        TransactionDirection
  amountMinor      Int
  currency         String              @default("RUB")
  category         TransactionCategory
  counterpartyName String?
  status           TransactionStatus   @default(POSTED)
  source           TransactionSource   @default(INTERNAL)
  idempotencyKey   String?             @unique
  postedAt         DateTime?
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
}

enum TransactionDirection {
  CREDIT
  DEBIT
}

enum TransactionStatus {
  POSTED
  PENDING
  FAILED
  CANCELED
}

enum TransactionSource {
  INTERNAL
  ADMIN
  STUB
}

enum TransactionCategory {
  TRANSFER
  TOPUP
  TAXI
  FOOD
  EDUCATION
  TRANSPORT
  SHOPPING
  ENTERTAINMENT
  OTHER
}
```

---

### Product (Продукт)

Банковские продукты (накопительные счета, кредиты и т.д.).

```typescript
{
  id: string (UUID)
  code: string (unique, например 'SAVINGS')
  name: string
  description: string?
  category: 'SAVING' | 'CREDIT'
  icon: string (название иконки)
  allowedRatings: number[] (массив от 1 до 5)
  isActive: boolean (default: true, для мягкого удаления)
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Связи:**
- `userProducts: UserProducts[]` (1:n) - пользователи, открывшие продукт

**Индексы:**
- `code` - unique index (уникальный код продукта)

**Product Category (Категория продукта):**
- `SAVING` - Накопительные продукты (счета, вклады)
- `CREDIT` - Кредитные продукты (кредиты, ипотеки, кредитные карты)

**Правила:**
- `allowedRatings` определяет уровни рейтинга, при которых продукт доступен
- `isActive=false` используется для мягкого удаления (продукт скрыт, но данные сохранены)
- Продукт считается доступным для пользователя если `allowedRatings.includes(user.ratingLevel)`

**Примеры продуктов:**
- Накопительный счёт (SAVINGS): `allowedRatings: [3, 4, 5]`
- Кредит (CREDIT): `allowedRatings: [4, 5]`
- Ипотека (MORTGAGE): `allowedRatings: [5]`
- Дебетовая карта (DEBIT_CARD): `allowedRatings: [1, 2, 3, 4, 5]`
- Кредитная карта (CREDIT_CARD): `allowedRatings: [3, 4, 5]`

**Prisma схема:**
```prisma
model Product {
  id             String          @id @default(uuid())
  code           String          @unique
  name           String
  description    String?
  category       ProductCategory
  icon           String
  allowedRatings Int[]
  isActive       Boolean         @default(true)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  userProducts UserProducts[]
}

enum ProductCategory {
  SAVING
  CREDIT
}
```

---

### UserProducts (Продукты пользователя)

Связь между пользователями и открытыми продуктами.

```typescript
{
  id: string (UUID)
  userId: string (FK)
  productId: string (FK)
  initialDeposit: number (default: 0, в минорных единицах)
  status: 'ACTIVE' | 'CLOSED' (default: 'ACTIVE')
  openedAt: DateTime
  closedAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Связи:**
- `user: User` (n:1) - владелец продукта
- `product: Product` (n:1) - ссылка на продукт

**Индексы:**
- `(userId, productId)` - **unique composite index** (предотвращение повторного открытия одного продукта)
- `(userId, status)` - composite index для быстрой выборки активных продуктов

**Правила:**
- Пользователь НЕ может открыть один и тот же продукт дважды (unique constraint)
- `initialDeposit` хранится в **минорных единицах**
- При открытии с `initialDeposit > 0`:
  - Проверяется достаточность баланса
  - Средства списываются с кошелька
  - Создаётся транзакция с `direction=DEBIT`
- `status=ACTIVE` - продукт активен
- `status=CLOSED` - продукт закрыт (дата в `closedAt`)

**Каскадное удаление:**
- При удалении `User` → удаляются связанные `UserProducts`
- При удалении `Product` → удаляются связанные `UserProducts`

**Prisma схема:**
```prisma
model UserProducts {
  id             String              @id @default(uuid())
  userId         String
  productId      String
  initialDeposit Int                 @default(0)
  status         UserProductStatus   @default(ACTIVE)
  openedAt       DateTime            @default(now())
  closedAt       DateTime?
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId, status])
}

enum UserProductStatus {
  ACTIVE
  CLOSED
}
```

---

## Работа с транзакциями БД

### Атомарные операции

Операции, изменяющие баланс, выполняются в **транзакции БД** для обеспечения консистентности:

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Уменьшить баланс
  await tx.wallet.update({
    where: { userId },
    data: { balanceMinor: { decrement: amount } }
  })

  // 2. Создать транзакцию
  await tx.transaction.create({
    data: {
      userId,
      direction: 'DEBIT',
      amountMinor: amount,
      category: 'TRANSFER',
      status: 'POSTED',
      postedAt: new Date()
    }
  })

  // 3. Создать UserProduct (если открытие продукта)
  await tx.userProducts.create({
    data: { userId, productId, initialDeposit: amount }
  })
})
```

### Проверка достаточности баланса

Перед списанием средств **всегда** проверяем баланс:

```typescript
const wallet = await prisma.wallet.findUnique({ where: { userId } })

if (wallet.balanceMinor < amountMinor) {
  throw new Error('Insufficient balance')
}
```

### Idempotency

Для предотвращения дубликатов используем `idempotencyKey`:

```typescript
// Проверка на дубликат
const existing = await prisma.transaction.findUnique({
  where: { idempotencyKey }
})

if (existing) {
  return existing // Вернуть существующую транзакцию
}

// Создать новую
await prisma.transaction.create({
  data: { ..., idempotencyKey }
})
```

---

## Валидация данных

### Email
- Валидный email формат
- Уникальный при регистрации
- Не более 255 символов

### Password
- Минимум 8 символов
- Хешируется через bcrypt (cost factor = 10)
- Никогда не возвращается в API

### RatingLevel
- Целое число от 1 до 5
- По умолчанию: 3 (средний)

### AmountMinor
- Положительное целое число
- В минорных единицах (копейки для RUB)
- Проверка: `amountMinor > 0`

### ФИО (firstName, lastName, middleName)
- Минимум 2 символа (если заполнено)
- `middleName` опционально
- Только буквы и дефис

### Currency
- Трёхбуквенный код (ISO 4217)
- Пока поддерживается только "RUB"

---

## Миграции

### Команды Prisma

```bash
# Создать миграцию
npx prisma migrate dev --name add_avatar_url

# Применить миграции (production)
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio (GUI для БД)
npx prisma studio
```

### Seed данные

```bash
# Заполнить БД тестовыми данными
npm run db:seed

# Сбросить БД и применить миграции + seed
npm run db:reset
```

---

## Best Practices

### ✅ DO:

1. **Всегда используй минорные единицы** для денежных сумм
2. **Используй транзакции БД** для атомарных операций
3. **Проверяй баланс** перед списанием средств
4. **Используй idempotencyKey** для предотвращения дубликатов
5. **Используй индексы** для часто используемых запросов
6. **Используй каскадное удаление** для связанных данных
7. **Валидируй входные данные** перед сохранением в БД

### ❌ DON'T:

1. **НЕ храни суммы в float/decimal** - только целые числа в минорных единицах
2. **НЕ позволяй отрицательный баланс**
3. **НЕ делай параллельные операции** с балансом без блокировок
4. **НЕ забывай про индексы** при добавлении новых запросов
5. **НЕ удаляй данные напрямую** - используй мягкое удаление (isActive)
6. **НЕ изменяй транзакции** после создания
7. **НЕ возвращай passwordHash** в API

---

**Следуй этим правилам для консистентной работы с данными!**
