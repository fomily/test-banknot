# Server

## Env
Create `.env` from example:

```
NODE_ENV=development
APP_ENV=local
PORT=4000
COOKIE_DOMAIN=localhost
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
DATABASE_URL=postgresql://banknot:banknot@localhost:5432/banknot?schema=public
JWT_SECRET=change-me-in-local
```

## Prisma
- Generate: `npm run prisma:generate`
- Migrate (dev): `npm run prisma:migrate:dev`
- Seed: `npm run prisma:seed`

## Run
- Dev: `npm run dev`
- Health: `GET /health`
- Docs (placeholder): `GET /docs`
