# aurel

## Backend Deployment (Render)

This monorepo has:
- `apps/web` (Next.js app + API routes)
- `apps/worker` (BullMQ background worker)

Deploy **two services** on Render from the same repo.

### 1) Web service
- Type: `Web Service`
- Root Directory: repo root (not `apps/web`)
- Build Command:
  - `pnpm install --frozen-lockfile && pnpm --filter web build`
- Start Command:
  - `pnpm --filter web start`

### 2) Worker service
- Type: `Background Worker`
- Root Directory: repo root
- Build Command:
  - `pnpm install --frozen-lockfile`
- Start Command:
  - `pnpm --filter worker start`

### 3) Managed dependencies
- Render PostgreSQL
- Render Redis

### 4) Environment variables

Set on **Web**:
- `DATABASE_URL`
- `REDIS_URL` (or `REDIS_HOST` + `REDIS_PORT` + optional `REDIS_PASSWORD`)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your Render web URL)
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Set on **Worker**:
- `DATABASE_URL`
- `REDIS_URL` (or `REDIS_HOST` + `REDIS_PORT` + optional `REDIS_PASSWORD`)
- `RESEND_API_KEY` (if email executor is used)

### 5) Migrations
Run on deploy (pre-deploy command/job):
- `pnpm --filter @aurel/db exec prisma migrate deploy`

## Local Backend with Docker Compose

Start Postgres + Redis:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Stop and remove volumes:

```bash
docker compose down -v
```
