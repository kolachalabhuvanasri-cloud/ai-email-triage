# Personal Expense Tracker Backend (FastAPI + SQLite)

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```

## API overview

- `POST /api/auth/signup` - register
- `POST /api/auth/login` - login
- `GET /api/auth/me` - current user
- `GET/POST/PUT/DELETE /api/transactions`
- `POST /api/transactions/{id}/receipt` - upload receipt image
- `GET/POST /api/budgets`
- `GET /api/dashboard` - totals + pie/trend data + budget alerts
- `GET /api/insights` - smart summary
- `GET /api/assistant?query=...` - simple assistant answers

## Notes

- Data is user-scoped with JWT auth.
- Recurring transactions auto-create monthly entries when you fetch transactions on their recurring day.
- SQLite file is `expense_tracker.db` in backend directory.
