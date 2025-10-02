---
alwaysApply: true
---

# 🧭 Навигация по правилам проекта

Этот документ помогает ориентироваться в правилах разработки проекта Banknot.

## 📖 Как использовать правила

- **Все файлы с правилами имеют `alwaysApply: true`** - они всегда активны
- При работе с конкретной частью проекта (backend/frontend), читайте соответствующие файлы
- Общие принципы находятся в `CORE.md` и `PORTS.md`

## 🗂️ Структура правил

### ⭐ Основа проекта (читать первым делом)

- **`CORE.md`** - Clean Architecture, монорепо, разделение ответственности
- **`PORTS.md`** - Фиксированные порты для всех сервисов (ВАЖНО!)

### 🏗️ Backend разработка

- **`backend-domains.md`** - Домены, use-cases, роуты, Prisma
- **`backend-security.md`** - JWT, cookies, аутентификация, error handling
- **`backend-environment.md`** - ENV переменные и конфигурация

### 🎨 Frontend разработка

- **`frontend-layout.md`** - Responsive вёрстка, WebView, CSS modules
- **`frontend-components.md`** - Компоненты из @packages/ui, Text, цвета

### 📋 API и интеграции

- **`api-contracts.md`** - API контракты, OpenAPI, zod schemas

### 🚀 Деплой и инфраструктура

- **`deployment.md`** - GitHub Pages (demo) + VPS (production)

### 🧪 Тестирование

- **`testing.md`** - Unit, integration, e2e тесты

## 🎯 Быстрая навигация по задачам

### Создаю новый экран frontend?
→ Читай: `CORE.md`, `frontend-layout.md`, `frontend-components.md`

### Создаю новый домен backend?
→ Читай: `CORE.md`, `backend-domains.md`, `backend-security.md`

### Добавляю API эндпоинт?
→ Читай: `backend-domains.md`, `api-contracts.md`

### Запускаю dev сервер?
→ Читай: `PORTS.md` (фиксированные порты!)

### Работаю с аутентификацией?
→ Читай: `backend-security.md`, `backend-environment.md`

### Добавляю компонент UI?
→ Читай: `frontend-components.md`, `frontend-layout.md`

### Делаю деплой?
→ Читай: `deployment.md`

### Пишу тесты?
→ Читай: `testing.md`

## 📚 Дополнительная документация

Кроме правил, есть документация в `/docs/`:

- **`DEVELOPER_ONBOARDING.md`** - Введение для новых разработчиков
- **`PROJECT_PLAN.md`** - План разработки и требования заказчика

## 🔥 Критически важные правила

1. **Фиксированные порты** (`PORTS.md`) - НЕ создавать новые порты без необходимости!
2. **Бизнес-логика ТОЛЬКО в backend доменах** - UI компоненты без логики
3. **Использовать существующие компоненты** - не создавать новые без нужды
4. **Clean Architecture** - разделение слоёв строго соблюдается
5. **WebView responsive** - flex/grid, rem/%, никаких position: absolute
6. **CSS Modules** - не inline styles
7. **ENV через zod** - валидация всех переменных окружения

## 🚨 Частые ошибки

❌ Создание новых портов вместо использования фиксированных
✅ Читай `PORTS.md` перед запуском dev серверов

❌ Бизнес-логика в UI компонентах
✅ Вся логика в backend доменах (use-cases)

❌ Создание новых Text стилей
✅ Используй существующие варианты Text компонента

❌ Использование position: absolute
✅ Используй flex/grid для layout

❌ Inline styles в компонентах
✅ Только CSS Modules

## 💡 Советы для эффективной работы

- Начинай с чтения `CORE.md` - это основа
- При работе с портами ВСЕГДА проверяй `PORTS.md`
- Перед созданием API смотри `api-contracts.md`
- Перед добавлением ENV переменной смотри `backend-environment.md`
- При вёрстке сначала проверь доступные компоненты в `frontend-components.md`

---

**Следуй этим правилам для консистентной и качественной разработки!**

