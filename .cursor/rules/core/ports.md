---
alwaysApply: true
---

# 🔌 Фиксированные порты

**КРИТИЧЕСКИ ВАЖНО:** Все порты в проекте зафиксированы! НЕ создавайте новые порты без необходимости.

## Локальные адреса и порты

| Сервис | Порт | URL | Описание |
|--------|------|-----|----------|
| API/Backend | 4000 | http://localhost:4000 | Express сервер |
| API Docs | 4000 | http://localhost:4000/docs | Swagger UI документация |
| БД (Adminer) | 8080 | http://localhost:8080 | Web интерфейс для PostgreSQL |
| Frontend (dev) | 5173 | http://localhost:5173 | Клиентское приложение с proxy |
| Frontend (preview) | 4173 | http://localhost:4173 | Локальный preview сборки |
| Admin (dev) | 5175 | http://localhost:5175 | Админ-панель (резерв) |
| UI песочница | 5177 | http://localhost:5177 | Компоненты @packages/ui |

## Правила использования портов

### ✅ Фиксированные порты

Все dev/preview-сервера используют **фиксированные порты** с `strictPort: true` в Vite конфигурации.

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // ❗ ВАЖНО: не искать другой порт
  }
})
```

### ✅ Proxy настройки (Frontend → Backend)

Клиент проксирует следующие пути на `http://localhost:4000`:

- `/auth` - аутентификация
- `/users` - пользователи
- `/products` - продукты
- `/docs` - API документация

```typescript
// apps/client/vite.config.ts
server: {
  proxy: {
    '/auth': 'http://localhost:4000',
    '/users': 'http://localhost:4000',
    '/products': 'http://localhost:4000',
    '/docs': 'http://localhost:4000',
  }
}
```

### ❌ Запреты

- **НЕ создавайте новые порты** без согласования
- **НЕ используйте динамические порты** (strictPort должен быть true)
- **НЕ отключайте неиспользуемые порты** без понимания зачем они нужны

## Запуск сервисов

### Backend (порт 4000)

```bash
npm run dev:server
```

Доступно на http://localhost:4000
Health check: http://localhost:4000/health
API docs: http://localhost:4000/docs

### Frontend (порт 5173)

```bash
npm run dev:client
```

Доступно на http://localhost:5173
Proxy: `/auth`, `/users`, `/products`, `/docs` → http://localhost:4000

### Frontend preview (порт 4173)

```bash
npm run preview:client
```

Локальный preview production сборки на http://localhost:4173

### Admin (порт 5175)

```bash
npm run dev:admin
```

Админ-панель (резерв, включится при реализации админки) на http://localhost:5175

### UI песочница (порт 5177)

```bash
npm run -w @packages/ui dev
```

Песочница компонентов @packages/ui на http://localhost:5177

### База данных (порт 8080)

```bash
npm run db:up
```

Adminer web-интерфейс для PostgreSQL на http://localhost:8080

## Проверка и освобождение портов

### Проверить занятые порты:

```bash
npm run ports:check
```

### Освободить порты разработки:

```bash
npm run ports:free
```

Убивает процессы на портах: 4000, 5173, 5175, 5177, 8080

## Конфликты портов

Если порт занят другим процессом:

1. **Проверь что запущено**: `lsof -i :<PORT>`
2. **Останови процесс**: `kill -9 <PID>`
3. **Или используй**: `npm run ports:free`

## Важные замечания

⚠️ **При запуске dev сервера ВСЕГДА используй фиксированные порты из этого файла!**

⚠️ **Если порт занят - останови процесс, а не меняй порт в конфигурации!**

⚠️ **strictPort: true гарантирует, что Vite не будет искать свободный порт автоматически**

## Примеры запуска

### Типичный workflow разработки:

```bash
# Терминал 1: База данных
npm run db:up

# Терминал 2: Backend сервер
npm run dev:server

# Терминал 3: Frontend клиент
npm run dev:client
```

Доступ к приложению: http://localhost:5173
Доступ к API: http://localhost:4000
Доступ к БД: http://localhost:8080

---

**Следуй этим правилам для консистентного окружения разработки!**
