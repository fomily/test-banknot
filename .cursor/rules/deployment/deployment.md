---
applyContext: deployment
---

# 🚀 Deployment

Этот файл описывает деплой demo версии на GitHub Pages и production deployment на VPS.

## Demo Deployment (GitHub Pages)

### Автоматизация

Демо версия **автоматически** деплоится на GitHub Pages при push тега `demo-*`.

### Триггер

Push тега вида `demo-*` запускает GitHub Actions workflow "Demo Deploy".

```bash
# Автоматическое имя тега с датой/временем
TAG=demo-$(date +%Y%m%d-%H%M%S)
git tag -a "$TAG" -m "Demo publish $TAG"
git push origin "$TAG"

# Или ручное имя
git tag -a demo-20250102-1200 -m "Demo publish"
git push origin demo-20250102-1200
```

### Что делает CI

1. Устанавливает зависимости (`npm ci`)
2. Ставит `NODE_ENV=production`, `APP_ENV=demo`
3. Собирает `apps/client` (`npm run -w @apps/client build`)
4. Кладёт сборку в ветку `gh-pages`
5. Добавляет `404.html` и `.nojekyll`

### Публикация

Системный GitHub Actions job "pages build and deployment" автоматически разворачивает ветку `gh-pages` на GitHub Pages.

### Настройки GitHub Pages

**Settings → Pages:**
- Source: Branch `gh-pages`
- Folder: `/` (root)

### Vite Configuration

В `apps/client/vite.config.ts` настроен `base` для корректной работы на Pages:

```typescript
export default defineConfig({
  base: '/test-banknot/',
  // ...
})
```

### Результат

Demo доступно по адресу: **https://fomily.github.io/test-banknot/**

### Важно

- **НЕ влияет на демо**: пуши в `main` (без тегов)
- **НЕ коммитить руками** в ветку `gh-pages` (её обновляет только CI)
- **Ветка `gh-pages`** создаётся автоматически при первом деплое

### Ожидаемые jobs

1. **Demo Deploy** - сборка и push в `gh-pages`
2. **pages build and deployment** - деплой на Pages

### Отладка

Если demo не обновляется:
1. Проверь Actions → All workflows → Demo Deploy
2. Проверь Settings → Pages → Source = Branch `gh-pages`
3. Проверь наличие файла `.github/workflows/demo-deploy.yml`

## Production Deployment (VPS)

### Провайдер

VPS на выбор: Hetzner, DigitalOcean, AWS, etc.

**OS:** Ubuntu 22.04 LTS

### Базовая настройка сервера

#### 1. Создание пользователя

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

#### 2. SSH ключи

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### 3. Firewall (ufw)

```bash
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable
```

#### 4. Обновления

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git
```

### Docker Installation

```bash
# Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo apt install -y docker-compose-plugin

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

### Reverse Proxy (Caddy)

**Caddy** обеспечивает автоматический HTTPS через Let's Encrypt.

#### Установка Caddy:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

#### Caddyfile:

```caddyfile
# /etc/caddy/Caddyfile

api.example.com {
    reverse_proxy localhost:4000
}
```

#### Запуск Caddy:

```bash
sudo systemctl enable caddy
sudo systemctl start caddy
sudo systemctl status caddy
```

### База данных

#### Вариант 1: Managed DB (рекомендуется)

Используй managed PostgreSQL от провайдера (DigitalOcean, AWS RDS, etc.).

**Плюсы:**
- Автоматические бэкапы
- Мониторинг
- Масштабирование

#### Вариант 2: Self-hosted PostgreSQL

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: banknot
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: banknot_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

**Бэкапы через crontab:**

```bash
# Backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec postgres pg_dump -U banknot banknot_prod > /backups/db_$TIMESTAMP.sql
find /backups -name "db_*.sql" -mtime +7 -delete

# Crontab (каждый день в 2:00)
0 2 * * * /home/deploy/backup-db.sh
```

### Environment Variables

Создай файл `.env` на сервере:

```bash
# /home/deploy/banknot/.env

NODE_ENV=production
APP_ENV=production

PORT=4000
DATABASE_URL=postgresql://user:password@db.example.com:5432/banknot_prod

JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

COOKIE_NAME_REFRESH=refreshToken
COOKIE_PATH_REFRESH=/auth/refresh
COOKIE_DOMAIN=.example.com
COOKIE_SECURE=true
COOKIE_SAMESITE=none

CORS_ORIGINS=https://app.example.com
DISABLE_CORS=false
```

**ВАЖНО:** Не коммить `.env` в git! Секреты хранить в GitHub Secrets или на сервере.

### Docker Deployment

#### Dockerfile для backend:

```dockerfile
# apps/server/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/*/package*.json ./packages/

RUN npm ci

COPY . .

RUN npm run -w @apps/server build
RUN npx prisma generate

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "-w", "@apps/server", "start"]
```

#### docker-compose.yml для production:

```yaml
version: '3.8'

services:
  server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    restart: always
    ports:
      - "4000:4000"
    env_file:
      - .env
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: banknot_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### CI/CD (GitHub Actions)

#### Deploy workflow:

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t ghcr.io/fomily/banknot-server:latest -f apps/server/Dockerfile .

      - name: Push to GHCR
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/fomily/banknot-server:latest

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/deploy/banknot
            docker compose pull
            docker compose up -d
            docker exec server npx prisma migrate deploy
```

### Миграции на production

```bash
# SSH в VPS
ssh deploy@your-server.com

# Перейти в директорию проекта
cd /home/deploy/banknot

# Применить миграции
docker exec server npx prisma migrate deploy

# Или локально через DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Мониторинг и логи

#### Просмотр логов:

```bash
# Docker logs
docker compose logs -f server

# Caddy logs
sudo journalctl -u caddy -f
```

#### Health check:

```bash
curl https://api.example.com/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

### Rollback

Если что-то пошло не так:

```bash
# Откатиться на предыдущий образ
docker compose down
docker tag ghcr.io/fomily/banknot-server:previous ghcr.io/fomily/banknot-server:latest
docker compose up -d
```

## Staging Environment

Для staging используй отдельный VPS или поддомен:

- **Staging URL**: `https://staging-api.example.com`
- **Отдельная БД**: staging database
- **Отдельные секреты**: GitHub Environment Secrets

```yaml
# Deploy to staging on push to develop branch
on:
  push:
    branches: [develop]
```

## Troubleshooting

### Ошибка: "Cannot connect to database"
➡️ Проверь DATABASE_URL в .env файле

### Ошибка: "CORS error"
➡️ Проверь CORS_ORIGINS - должен быть реальный домен с https://

### Ошибка: "Certificate error"
➡️ Проверь Caddy конфигурацию и DNS A-запись

### Демо не обновляется
➡️ Проверь GitHub Actions → Demo Deploy workflow

### Server не стартует
➡️ Проверь docker logs: `docker compose logs -f server`

---

**Следуй этим правилам для успешного деплоя!**
