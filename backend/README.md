# AI Email Triage Backend

## Architecture

- **Runtime**: Node.js + Express 5.
- **Database**: MongoDB via Mongoose.
- **Structure**:
  - `src/config` for environment and DB connection.
  - `src/models` for Mongo schemas.
  - `src/controllers` for endpoint logic.
  - `src/routes` for request mappings + validators.
  - `src/services` for triage business logic.
  - `src/middleware` for validation and centralized errors.
  - `src/data` for seed script and sample data.
- **Frontend compatibility**: Implements exactly the endpoints currently called by the frontend:
  - `GET /emails`
  - `GET /emails/:id`
  - `PATCH /emails/:id`
  - `POST /triage-email`

No authentication is currently required because the frontend does not send auth tokens and has no auth flow.

## Quick start

1. Install backend deps:

   ```bash
   cd backend
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

3. Start MongoDB locally (or update `MONGODB_URI` to use your remote cluster).

4. (Optional) seed sample emails:

   ```bash
   npm run seed
   ```

5. Run backend:

   ```bash
   npm run dev
   ```

6. Point frontend to backend in root `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```

## API documentation

### `GET /health`
Response:

```json
{
  "status": "ok",
  "service": "ai-email-triage-backend"
}
```

### `GET /emails`
Returns all emails sorted by `received_at` desc.

Response example:

```json
[
  {
    "id": "67ecf5cdbfcf4f5740b97ec5",
    "sender": "maria@northstarhq.com",
    "customer_name": "Maria Gomez",
    "subject": "Invoice shows duplicate charge for March",
    "body": "Hi team, ...",
    "snippet": "Hi team, Our March invoice looks like...",
    "received_at": "2026-04-01T08:10:00.000Z",
    "status": "triaged",
    "triage": {
      "category": "billing",
      "priority": "medium",
      "assigned_team": "billing",
      "summary": "Customer reports a duplicate charge...",
      "suggested_reply": "Thanks for flagging this...",
      "confidence": 0.94,
      "needs_human_review": false,
      "reviewer_notes": "",
      "approved": true,
      "last_updated_at": "2026-04-01T08:20:00.000Z"
    }
  }
]
```

### `GET /emails/:id`
Returns one email by Mongo `id`.

Errors:
- `404` when not found.
- `400` when `id` format is invalid.

### `POST /triage-email`
Runs AI-style triage and writes result to selected email.

Request:

```json
{
  "id": "67ecf5cdbfcf4f5740b97ec5",
  "sender": "maria@northstarhq.com",
  "subject": "Invoice shows duplicate charge for March",
  "body": "Hi team, ..."
}
```

Response: updated `EmailRecord` object.

### `PATCH /emails/:id`
Partially updates triage data and recalculates `status`:
- `reviewed` when `approved === true`
- `triaged` otherwise

Request body fields (all optional):

```json
{
  "category": "billing",
  "priority": "medium",
  "assigned_team": "billing",
  "summary": "...",
  "suggested_reply": "...",
  "confidence": 0.91,
  "needs_human_review": false,
  "reviewer_notes": "optional notes",
  "approved": true
}
```

Response: updated `EmailRecord` object.

## Assumptions

- Frontend remains the source of user session state; backend is stateless for auth.
- Mongo ObjectId is used as canonical `id`; frontend accepts string `id` values.
- Triage uses deterministic keyword rules to match the frontend fallback behavior.
