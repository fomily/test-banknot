---
alwaysApply: true
---

# 🧭 Навигация по правилам проекта

Этот документ помогает ориентироваться в правилах разработки проекта Banknot.

## 📖 Как использовать правила

Правила разделены по контекстам для оптимизации работы ИИ:

- **Базовые правила** (всегда активны) - `core/`
- **Frontend правила** - `frontend/` (активировать при верстке)
- **Backend правила** - `backend/` (активировать при серверной разработке)
- **API правила** - `api/` (активировать при работе с API)
- **Деплой правила** - `deployment/` (активировать при деплое)
- **Тестирование** - `testing/` (активировать при тестировании)

## 🗂️ Структура правил

### ⭐ Базовые принципы (всегда активны)

- **`core/architecture.md`** - Clean Architecture, монорепо, разделение ответственности
- **`core/ports.md`** - Фиксированные порты для всех сервисов (ВАЖНО!)
- **`core/navigation.md`** - Этот файл с навигацией

### 🎨 Frontend разработка (активировать при верстке)

- **`frontend/components.md`** - Компоненты из @packages/ui, Text, цвета
- **`frontend/layout.md`** - Responsive вёрстка, WebView, CSS modules

### 🏗️ Backend разработка (активировать при серверной разработке)

- **`backend/domains.md`** - Домены, use-cases, роуты, Prisma
- **`backend/security.md`** - JWT, cookies, аутентификация, error handling
- **`backend/environment.md`** - ENV переменные и конфигурация
- **`backend/data-models.md`** - Модели данных, Prisma схемы

### 📋 API и интеграции (активировать при работе с API)

- **`api/contracts.md`** - API контракты, OpenAPI, zod schemas

### 🚀 Деплой и инфраструктура (активировать при деплое)

- **`deployment/deployment.md`** - GitHub Pages (demo) + VPS (production)

### 🧪 Тестирование (активировать при тестировании)

- **`testing/testing.md`** - Unit, integration, e2e тесты

## 🎯 Быстрая навигация по задачам

### Создаю новый экран frontend?
→ Читай: `core/architecture.md`, `frontend/layout.md`, `frontend/components.md`

### Создаю новый домен backend?
→ Читай: `core/architecture.md`, `backend/domains.md`, `backend/security.md`

### Добавляю API эндпоинт?
→ Читай: `backend/domains.md`, `api/contracts.md`

### Запускаю dev сервер?
→ Читай: `core/ports.md` (фиксированные порты!)

### Работаю с аутентификацией?
→ Читай: `backend/security.md`, `backend/environment.md`

### Добавляю компонент UI?
→ Читай: `frontend/components.md`, `frontend/layout.md`

### Делаю деплой?
→ Читай: `deployment/deployment.md`

### Пишу тесты?
→ Читай: `testing/testing.md`

## 📚 Дополнительная документация

Кроме правил, есть документация в `/docs/`:

- **`DEVELOPER_ONBOARDING.md`** - Введение для новых разработчиков
- **`PROJECT_PLAN.md`** - План разработки и требования заказчика

## 🔥 Критически важные правила

1. **Фиксированные порты** (`core/ports.md`) - НЕ создавать новые порты без необходимости!
2. **Бизнес-логика ТОЛЬКО в backend доменах** - UI компоненты без логики
3. **Использовать существующие компоненты** - не создавать новые без нужды
4. **Clean Architecture** - разделение слоёв строго соблюдается
5. **WebView responsive** - flex/grid, rem/%, никаких position: absolute
6. **CSS Modules** - не inline styles
7. **ENV через zod** - валидация всех переменных окружения

## 🚨 Частые ошибки

❌ Создание новых портов вместо использования фиксированных
✅ Читай `core/ports.md` перед запуском dev серверов

❌ Бизнес-логика в UI компонентах
✅ Вся логика в backend доменах (use-cases)

❌ Создание новых Text стилей
✅ Используй существующие варианты Text компонента

❌ Использование position: absolute
✅ Используй flex/grid для layout

❌ Inline styles в компонентах
✅ Только CSS Modules

## 💡 Советы для эффективной работы

- Начинай с чтения `core/architecture.md` - это основа
- При работе с портами ВСЕГДА проверяй `core/ports.md`
- Перед созданием API смотри `api/contracts.md`
- Перед добавлением ENV переменной смотри `backend/environment.md`
- При вёрстке сначала проверь доступные компоненты в `frontend/components.md`

---

**Следуй этим правилам для консистентной и качественной разработки!**
