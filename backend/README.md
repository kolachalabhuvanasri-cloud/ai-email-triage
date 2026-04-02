# AI Email Triage Backend

## Architecture

This backend is a REST API built with **Node.js + Express + MongoDB (Mongoose)** and mirrors the frontend contract exactly.

- `GET /api/emails` → list inbox records.
- `GET /api/emails/:id` → fetch selected message.
- `POST /api/triage-email` → generates AI-like triage output and stores it.
- `PATCH /api/emails/:id` → persists reviewer edits, approval, reassignment, and review flags.

### Folder structure

```text
backend/
  src/
    app.js
    server.js
    config/
      db.js
      env.js
    controllers/
      auth.controller.js
      email.controller.js
    data/
      seedData.js
      seedEmails.js
    middleware/
      asyncHandler.js
      auth.js
      errorHandler.js
      validate.js
    models/
      email.model.js
      user.model.js
    routes/
      auth.routes.js
      email.routes.js
    services/
      triage.service.js
    utils/
      httpError.js
      password.js
```

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

If MongoDB is not running, the API will automatically fall back to in-memory storage unless `MONGODB_REQUIRED=true`.

3. Seed initial email data (optional, recommended for matching frontend demo state):

```bash
npm run seed
```

4. Start API:

```bash
npm run dev
```

5. Frontend configuration:

Set frontend `.env` to:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

## API documentation

### Health

#### `GET /health`
Response:

```json
{
  "status": "ok"
}
```

### Email endpoints (frontend-required)

#### `GET /api/emails`
Returns array of `EmailRecord` used by `listEmails()`.

Example response:

```json
[
  {
    "id": "67f0e...",
    "sender": "maria@northstarhq.com",
    "customer_name": "Maria Gomez",
    "subject": "Invoice shows duplicate charge for March",
    "body": "Hi team...",
    "snippet": "Hi team, Our March invoice...",
    "received_at": "2026-04-01T08:10:00.000Z",
    "status": "triaged",
    "triage": {
      "category": "billing",
      "priority": "medium",
      "assigned_team": "billing",
      "summary": "...",
      "suggested_reply": "...",
      "confidence": 0.94,
      "needs_human_review": false,
      "reviewer_notes": "",
      "approved": true,
      "last_updated_at": "2026-04-01T08:20:00.000Z"
    }
  }
]
```

#### `GET /api/emails/:id`
Returns one `EmailRecord`.

Error response:

```json
{
  "message": "Email not found."
}
```

#### `POST /api/triage-email`
Matches frontend payload from `triageEmail()`.

Request body:

```json
{
  "id": "67f0e...",
  "sender": "ops@riverandpine.io",
  "subject": "Production outage after latest deployment",
  "body": "Hello, Right after..."
}
```

Response: updated `EmailRecord` with generated `triage` + `status`.

#### `PATCH /api/emails/:id`
Matches frontend `updateEmail()` payload.

Request body (any subset allowed):

```json
{
  "category": "bug",
  "priority": "high",
  "assigned_team": "engineering",
  "summary": "Updated summary",
  "suggested_reply": "Updated draft",
  "confidence": 0.9,
  "needs_human_review": true,
  "reviewer_notes": "Escalated",
  "approved": false
}
```

Response: updated `EmailRecord`.

### Auth endpoints (JWT + roles + session controls)

These endpoints now include role-based access claims, optional remember-me sessions, and Google login support.


#### Roles

- `admin`
- `support_agent`

`/api/emails*` requires an authenticated user with one of the above roles.
`/api/activity-logs` is restricted to `admin`.

#### Session behavior

- `remember_me: true` on login/signup/google uses `JWT_REMEMBER_EXPIRES_IN` (default `30d`).
- Otherwise tokens use `JWT_EXPIRES_IN` (default `1d`).
- Sessions also enforce inactivity timeout via `SESSION_IDLE_TIMEOUT_MINUTES` (default `30`).

#### `POST /api/auth/signup`
Body:

```json
{
  "name": "Support Lead",
  "email": "lead@example.com",
  "password": "StrongPassword123!"
}
```

#### `POST /api/auth/login`
Body:

```json
{
  "email": "lead@example.com",
  "password": "StrongPassword123!"
}
```

Signup/login/google respond:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Support Lead",
    "email": "lead@example.com"
  }
}
```

#### `GET /api/auth/me`
Header:

```bash
Authorization: Bearer <jwt>
```

Response:

```json
{
  "user": {
    "id": "...",
    "name": "Support Lead",
    "email": "lead@example.com"
  }
}
```

## Assumptions made

- Frontend expects exact field names (snake_case for `customer_name`, `assigned_team`, etc.), so backend keeps those names.
- Frontend currently has no auth wiring; auth APIs are provided but not enforced for email routes.
- Triage generation intentionally mimics frontend mock logic so behavior is consistent when switching to real API mode.


#### `POST /api/auth/google`
Body:

```json
{
  "id_token": "<google-id-token>",
  "remember_me": true
}
```

Requires `GOOGLE_CLIENT_ID` to be configured in backend env.

#### `GET /api/activity-logs`
Header:

```bash
Authorization: Bearer <jwt>
```

Query params:
- `limit` (optional, default 100, max 500)

Returns recent activity entries including who viewed which email (`action: "email.view"`).
