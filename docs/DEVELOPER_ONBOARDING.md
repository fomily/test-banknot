# Описание проекта для нового разработчика

## Обзор проекта

**Banknot** - это банковское мобильное приложение (WebView) с современным стеком технологий, построенное как монорепозиторий. Приложение включает клиентскую часть, админ-панель и серверное API.

### Основные возможности:
- 🏦 Управление банковскими счетами и продуктами
- 💳 Финансовые транзакции (пополнения, переводы, платежи)
- 👤 Профиль пользователя с рейтинговой системой
- 📱 Адаптивный интерфейс для мобильных устройств (320px-500px)
- 🔐 JWT аутентификация с refresh токенами
- 🛡️ Безопасность (CORS, helmet, rate limiting)

## Архитектура проекта

### Монорепозиторий (npm workspaces)
```
/test-banknot/
├── apps/                 # Приложения
│   ├── server/          # Express.js сервер
│   ├── client/          # React клиент
│   └── admin/           # Админ-панель
├── packages/            # Разделяемые пакеты
│   ├── ui/              # UI компоненты
│   ├── api/             # HTTP клиент и DTO
│   ├── config/          # Конфигурация (ENV, CORS)
│   └── security/        # Безопасность (JWT, хеширование)
└── scripts/             # Утилиты
```

## Backend (apps/server)

### Архитектура доменов
Каждый домен - это один компактный файл в `apps/server/src/<domain>/index.ts`:
- **Регистрация роутов** (`express.Router()`)
- **Локальные use-cases** (группой в одном файле)
- **Работа с БД** через Prisma
- **Вспомогательные хелперы** локально внутри домена

### Текущие домены:
- `auth/` - аутентификация, регистрация, refresh токены
- `users/` - управление пользователями
- `products/` - банковские продукты
- `transactions/` - финансовые операции
- `wallet/` - управление балансом

### Пример структуры домена (auth/index.ts):
```typescript
// Роутер + use-cases + хелперы в одном файле
export const authRouter = Router()

// Use-cases
async function registerUser(params: { email: string; password: string }) {
  // бизнес-логика здесь
}

// Роуты
authRouter.post('/register', async (req, res, next) => {
  const result = await registerUser(req.body)
  res.json(result)
})
```

## Frontend (apps/client)

### Архитектура экранов
Одностраничное приложение с экранами:
- `main` - главный экран с балансом и быстрыми действиями
- `products` - банковские продукты пользователя
- `rating` - рейтинг и достижения
- `profile` - профиль пользователя
- `wallet` - детальная информация о кошельке

### Компонентная архитектура
Использует разделяемый пакет `@packages/ui`:
```tsx
import { Text, Card, IconButton, Badge } from '@packages/ui'

const MainScreen = () => (
  <div>
    <Text variant="headingL" color="primary">Баланс</Text>
    <Card>
      <IconButton icon="qr" onClick={handleScan}>
        Сканировать
      </IconButton>
    </Card>
  </div>
)
```

## Разделяемые пакеты (packages/)

### @packages/ui
UI компоненты для всего приложения:
- `Text` - текстовые элементы с вариантами стилей
- `Card` - контейнеры для контента
- `IconButton` - кнопки с иконками
- `Avatar` - аватары пользователей
- `Badge` - значки и метки
- `Menu` - навигационные меню
- `ProductCard` - карточки банковских продуктов

**Важно**: Компоненты содержат только визуальное представление и проброс событий. Бизнес-логика запрещена в UI компонентах.

### @packages/api
HTTP клиент для взаимодействия с сервером:
```typescript
import { apiClient } from '@api/client'

// Автоматический refresh токенов
const user = await apiClient.request('/users/me')
```

### @packages/config
Конфигурация приложения:
- Загрузка ENV переменных
- Настройка CORS
- Валидация конфигурации

### @packages/security
Сервисы безопасности:
- `JwtTokenService` - работа с JWT токенами
- `BcryptPasswordHasher` - хеширование паролей

## База данных

### PostgreSQL + Prisma ORM
Модели данных:
- `User` - пользователи с профилями и рейтингом
- `Wallet` - кошельки с балансом
- `Product` - банковские продукты (сберегательные счета, кредиты)
- `Transaction` - финансовые транзакции
- `UserProducts` - связь пользователей с продуктами

### Миграции и сиды:
```bash
npm run db:migrate    # Применить миграции
npm run db:seed       # Заполнить тестовыми данными
```

## Аутентификация и безопасность

### JWT токены:
- **Access токен** - в памяти клиента (short-lived)
- **Refresh токен** - HttpOnly cookie (long-lived)

### Эндпоинты аутентификации:
- `POST /auth/register` - регистрация
- `POST /auth/login` - вход в систему
- `POST /auth/refresh` - обновление токенов
- `POST /auth/logout` - выход

## Система сборки

### Разработка:
```bash
npm run dev:server    # Сервер на порту 4000
npm run dev:client    # Клиент на порту 5173
npm run dev:admin     # Админка на порту 5174
```

### Продакшн:
```bash
npm run -w @apps/client build  # Сборка клиента
npm run -w @apps/server build  # Сборка сервера
```

### Деплой демо-версии:
Автоматический деплой на GitHub Pages по тегам `demo-*`:
```bash
git tag -a demo-20250101-1200 -m "Demo publish"
git push origin demo-20250101-1200
```

## Правила разработки

### Обязательные принципы:

1. **Читаем правила перед написанием кода** - все принципы архитектуры строго соблюдаются

2. **Используем существующие компоненты** - не создаем новые UI элементы без необходимости

3. **Бизнес-логика только в доменах сервера** - UI компоненты только для отображения

4. **Clean Architecture** - разделение слоев, dependency injection вручную

5. **TypeScript везде** - строгие типы для всех модулей

6. **Responsive дизайн** - поддержка экранов 320px-500px

7. **CSS Modules** - стилизация через модули

8. **Path aliases** - используем `@packages/ui`, `@api`

### Структура кода:
- Каждый пакет имеет `src/index.ts`
- Все зависимости разделены по пакетам
- UI и логика строго разделены

## Начало работы

### 1. Установка зависимостей:
```bash
npm install
```

### 2. Запуск базы данных:
```bash
npm run db:up
npm run db:migrate
npm run db:seed
```

### 3. Переменные окружения:
Создать `apps/server/.env` по образцу из README.md

### 4. Запуск разработки:
```bash
npm run dev:server  # Терминал 1
npm run dev:client  # Терминал 2
```

### 5. Доступ к приложению:
- Клиент: http://localhost:5173
- Сервер API: http://localhost:4000
- Adminer (БД): http://localhost:8080

## Полезные команды

```bash
npm run ports:check  # Проверить занятые порты
npm run ports:free   # Освободить порты разработки
npm run db:reset     # Полный сброс БД
npm run lint         # Проверка кода линтером
```

## Структура проекта в деталях

### Backend структура:
```
apps/server/src/
├── app.ts           # Главное приложение (middleware)
├── index.ts         # Точка входа сервера
├── prisma.ts        # Конфигурация Prisma
└── <domain>/        # Домены
    └── index.ts     # Роуты + use-cases + хелперы
```

### Frontend структура:
```
apps/client/src/
├── App.tsx          # Главный компонент приложения
├── main.tsx         # Точка входа React
├── components/      # Экраны приложения
│   ├── Main/        # Главный экран
│   ├── Products/    # Продукты
│   ├── WalletScreen/# Кошелек
│   └── ...
└── types/           # Типы TypeScript
```

## Документация проекта

### 📚 Основные документы

#### [REQUIREMENTS.md](REQUIREMENTS.md)
**Бизнес-требования проекта**
- Функциональные требования по доменам
- Модели данных и их связи
- Пользовательские сценарии
- Бизнес-правила и валидация
- Ограничения и будущие расширения

**Когда читать:** При изучении бизнес-логики, добавлении новых функций.

#### [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
**План реализации с прогрессом**
- Этапы разработки с чекбоксами
- Критерии готовности для каждого этапа
- Команды для проверки после завершения
- Актуальный статус реализации (обновляется по ходу работы)

**Когда читать:** При планировании задач, проверке прогресса проекта.

#### [.cursor/rules/](../.cursor/rules/)
**Технические правила разработки**
- `CORE.md` - Clean Architecture, монорепо, разделение ответственности
- `backend-domains.md` - Домены, use-cases, роуты, Prisma
- `backend-security.md` - JWT, cookies, аутентификация, error handling
- `api-contracts.md` - API контракты, OpenAPI, zod schemas
- `frontend-components.md` - Компоненты из @packages/ui
- `frontend-layout.md` - Responsive вёрстка, WebView, CSS modules
- `deployment.md` - Деплой и инфраструктура
- `testing.md` - Тестирование

**Когда читать:** Перед написанием кода! Правила строго соблюдаются.

### 📖 Структура документации

```
docs/
├── DEVELOPER_ONBOARDING.md  ← Ты здесь! Введение для новых разработчиков
├── REQUIREMENTS.md          ← ЧТО нужно сделать (бизнес-требования)
└── IMPLEMENTATION_PLAN.md   ← КАК мы это делаем (план реализации)

.cursor/rules/               ← КАК правильно писать код (технические правила)
```

### 🎯 Когда что читать

**Хочу понять бизнес-логику проекта:**
→ [REQUIREMENTS.md](REQUIREMENTS.md)

**Хочу узнать, что уже реализовано:**
→ [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

**Хочу написать код:**
→ [.cursor/rules/](../.cursor/rules/) (сначала правила!)

**Хочу быстро начать работу:**
→ Этот файл (DEVELOPER_ONBOARDING.md)

## Следующие шаги для изучения:

1. Прочитать [REQUIREMENTS.md](REQUIREMENTS.md) для понимания бизнес-логики
2. Посмотреть [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) для понимания прогресса
3. Изучить правила в [.cursor/rules/CORE.md](../.cursor/rules/CORE.md)
4. Изучить схему БД в `apps/server/prisma/schema.prisma`
5. Посмотреть примеры компонентов в `packages/ui/src/components/`
6. Изучить доменную архитектуру в `apps/server/src/auth/index.ts`
7. Запустить приложение и посмотреть как всё взаимодействует
8. Изучить API клиента в `packages/api/src/client/`

## Контакты и поддержка

При возникновении вопросов обращайтесь к ведущему разработчику или изучите:
- [REQUIREMENTS.md](REQUIREMENTS.md) для бизнес-требований
- [.cursor/rules/](../.cursor/rules/) для правил архитектуры
- README.md для настройки окружения
- Комментарии в коде для понимания логики

---

*Добро пожаловать в команду! Следуйте этим принципам для эффективной разработки.*
