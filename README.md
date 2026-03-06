<h1 align="center">
  <br/>
  ⚡ Aurel
  <br/>
</h1>

<p align="center">
  <strong>Visual Workflow Automation Platform</strong><br/>
  Build, trigger, and run multi-step automations with a drag-and-drop editor — powered by a Next.js frontend and a BullMQ job worker.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/BullMQ-Queue-red?logo=redis" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" />
  <img src="https://img.shields.io/badge/pnpm-Workspaces-orange?logo=pnpm" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Workflow Nodes](#workflow-nodes)
- [Data Models](#data-models)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Deployment (Render)](#deployment-render)
- [Project Structure](#project-structure)

---

## Overview

**Aurel** is a no-code/low-code workflow automation platform. Users can visually design multi-step workflows using a drag-and-drop canvas (powered by React Flow), wire up nodes, and trigger them via webhooks. Workflows execute asynchronously through a BullMQ job queue backed by Redis, with full per-node execution logs stored in PostgreSQL.

**Key capabilities:**
- 🖱️ Visual drag-and-drop workflow editor
- 🔗 Webhook triggers per workflow (unique secret per workflow)
- 📧 Send emails via **Resend**
- 🌐 Make arbitrary HTTP requests
- 🔀 Conditional branching (`if` node with operators: `=`, `contains`, `>`, `<`, `exists`)
- 📝 Set and transform data between nodes
- 📊 Full execution logs with per-node status tracking
- 🔐 OAuth authentication (GitHub & Google) via NextAuth v5
- 🌙 Dark mode support

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        apps/web                         │
│  Next.js 16 App Router                                  │
│  ┌─────────────────────┐   ┌───────────────────────┐   │
│  │  Workflow Editor     │   │  API Routes           │   │
│  │  (React Flow canvas) │   │  /api/workflows       │   │
│  │                      │   │  /api/executions      │   │
│  │  Zustand store       │   │  /api/webhooks        │   │
│  │  SWR data fetching   │   │  /api/emails/send     │   │
│  └─────────────────────┘   └──────────┬────────────┘   │
└──────────────────────────────────────-│─────────────────┘
                                        │ Enqueues jobs
                                        ▼
                              ┌─────────────────┐
                              │      Redis       │
                              │  (BullMQ Queue)  │
                              └────────┬─────────┘
                                       │ Dequeues jobs
                                       ▼
                        ┌──────────────────────────────┐
                        │         apps/worker           │
                        │  BullMQ Worker (concurrency=5)│
                        │  ┌───────────────────────┐   │
                        │  │  Workflow Engine       │   │
                        │  │  executeWorkflow()     │   │
                        │  │                        │   │
                        │  │  Executors:            │   │
                        │  │  • email   • http      │   │
                        │  │  • if      • set       │   │
                        │  │  • webhook             │   │
                        │  └───────────────────────┘   │
                        └──────────────────────────────┘
                                       │ Read/Write
                                       ▼
                              ┌─────────────────┐
                              │   PostgreSQL     │
                              │  (via Prisma)    │
                              └─────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 (App Router) |
| UI Library | React 19 + shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP, motion |
| 3D / Effects | Three.js, React Three Fiber, OGL |
| Workflow Canvas | React Flow (`@xyflow/react`) |
| State Management | Zustand |
| Data Fetching | SWR |
| Authentication | NextAuth v5 (GitHub + Google OAuth) |
| Job Queue | BullMQ + IORedis |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Email | Resend |
| HTTP Client | Axios |
| Package Manager | pnpm (Workspaces) |
| Language | TypeScript 5 |

---

## Workflow Nodes

Each node in a workflow has a **type** and configurable **data**. The worker resolves them at execution time.

| Node Type | Description |
|---|---|
| `trigger` / `webhook` | Entry point of a workflow. Workflows expose a unique `POST /api/webhooks/:id` endpoint that queues a job with the request body as `triggerData`. |
| `email` | Sends an HTML email via the Resend API. Supports template interpolation from previous node outputs (`{{field.path}}`). |
| `http` | Makes an arbitrary HTTP request (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and passes the response body to the next node. |
| `if` | Conditional branching. Evaluates a field on the current data payload against a value using operators: `=`, `contains`, `>`, `<`, `exists`. Routes to `true` or `false` branches. |
| `set` | Sets or transforms data fields on the payload before passing it to the next node. |

---

## Data Models

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String?
  image     String?
  workflows Workflow[]
  createdAt DateTime   @default(now())
}

model Workflow {
  id            String      @id @default(cuid())
  name          String
  userId        String
  nodes         Json        // React Flow nodes array
  edges         Json        // React Flow edges array
  active        Boolean     @default(false)
  webhookSecret String      @default(cuid())
  executions    Execution[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Execution {
  id         String    @id @default(cuid())
  workflowId String
  status     String    // "queued" | "running" | "success" | "failed"
  input      Json      // trigger payload
  logs       Json      // per-node results array
  startedAt  DateTime  @default(now())
  endedAt    DateTime?
}
```

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) ≥ 10 — `npm install -g pnpm`
- [Docker](https://www.docker.com/) (for local Postgres + Redis)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/aurel-monorepo.git
cd aurel-monorepo
pnpm install
```

### 2. Start Infrastructure

Start local PostgreSQL and Redis using Docker Compose:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Stop and remove all data volumes:

```bash
docker compose down -v
```

### 3. Configure Environment Variables

Copy and fill in the required variables (see [Environment Variables](#environment-variables)):

```bash
# For the web app
cp apps/web/.env.local.example apps/web/.env.local

# For the worker
cp apps/worker/.env.example apps/worker/.env

# For the database package
cp packages/db/.env.example packages/db/.env
```

### 4. Run Migrations & Generate Prisma Client

```bash
pnpm db:migrate:deploy
pnpm db:generate
```

### 5. Start Dev Servers

Run the web app and worker in separate terminals:

```bash
# Terminal 1 — Next.js web app
pnpm dev:web

# Terminal 2 — BullMQ background worker
pnpm dev:worker
```

---

## Environment Variables

### `apps/web` — Web App

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string (e.g. `redis://localhost:6379`) |
| `REDIS_HOST` | Redis host (alternative to `REDIS_URL`) |
| `REDIS_PORT` | Redis port (default: `6379`) |
| `REDIS_PASSWORD` | Redis password (optional) |
| `NEXTAUTH_SECRET` | Secret for signing NextAuth session tokens |
| `NEXTAUTH_URL` | Canonical URL of the app (e.g. `http://localhost:3000`) |
| `GITHUB_ID` | GitHub OAuth App Client ID |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret |

### `apps/worker` — Background Worker

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `REDIS_HOST` | Redis host (alternative to `REDIS_URL`) |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password (optional) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | Default sender address (e.g. `noreply@yourdomain.com`) |

---

## Database Migrations

Run Prisma migrations against the configured `DATABASE_URL`:

```bash
# Apply pending migrations
pnpm db:migrate:deploy

# Regenerate Prisma client after schema changes
pnpm db:generate
```

When making schema changes, create a new migration:

```bash
pnpm --filter @aurel/db exec prisma migrate dev --name <migration-name>
```

---

## Deployment (Render)

Deploy **two separate services** from this monorepo on [Render](https://render.com).

### Managed Dependencies (create first)

1. **Render PostgreSQL** — copy the internal connection string as `DATABASE_URL`
2. **Render Redis** — copy the internal `REDIS_URL`

### Service 1 — Web App

| Setting | Value |
|---|---|
| Type | `Web Service` |
| Root Directory | _(repo root)_ |
| Build Command | `pnpm install --frozen-lockfile && pnpm run db:generate && pnpm --filter web build` |
| Start Command | `pnpm --filter web start` |
| Environment Variables | See [Web App env vars](#appswebweb-app) |

### Service 2 — Background Worker

| Setting | Value |
|---|---|
| Type | `Background Worker` |
| Root Directory | _(repo root)_ |
| Build Command | `pnpm install --frozen-lockfile && pnpm run db:generate` |
| Start Command | `pnpm --filter worker start` |
| Environment Variables | See [Worker env vars](#appsworkerbackground-worker) |

### Pre-deploy: Run Migrations

Add a **pre-deploy job** or run once manually:

```bash
pnpm --filter @aurel/db exec prisma migrate deploy
```

---

## Project Structure

```
aurel-monorepo/
├── apps/
│   ├── web/                     # Next.js 16 App Router frontend
│   │   ├── app/
│   │   │   ├── api/             # API routes (workflows, executions, webhooks, emails)
│   │   │   ├── dashboard/       # Dashboard page
│   │   │   ├── editor/          # Visual workflow editor (React Flow)
│   │   │   ├── executions/      # Execution history & logs viewer
│   │   │   └── docs/            # Documentation pages
│   │   ├── components/          # Shared UI components (shadcn/ui)
│   │   ├── store/               # Zustand stores
│   │   └── lib/                 # Utility functions
│   │
│   └── worker/                  # BullMQ background worker
│       ├── engine/              # Core workflow execution engine
│       ├── executors/           # Node executors (email, http, if, set, webhook)
│       ├── utils/               # Helpers (e.g. template resolution)
│       └── index.ts             # Worker entry point
│
└── packages/
    └── db/                      # Shared Prisma DB package (@aurel/db)
        └── prisma/
            └── schema.prisma    # Database schema (User, Workflow, Execution)
```

---

<p align="center">
  Built with ❤️ using Next.js, BullMQ, Prisma, and React Flow.
</p>
