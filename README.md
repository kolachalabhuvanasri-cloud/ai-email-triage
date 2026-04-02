# AI Email Triage Frontend + Backend

This repository now contains:

- `src/` → React + TypeScript + Vite frontend dashboard
- `backend/` → Express + MongoDB REST API that matches frontend endpoint expectations

## Frontend quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Set:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

## Backend quick start

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Detailed backend architecture, setup, and full API docs are in [`backend/README.md`](backend/README.md).
