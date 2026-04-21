# Personal Expense Tracker (Full Stack)

A modern, beginner-friendly full-stack expense tracker built with:

- **Frontend**: React + TypeScript + hooks
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **Styling**: Clean responsive CSS

## Project Structure

```text
.
├── src/                     # React frontend
│   ├── app/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── services/api.ts
│   ├── styles/index.css
│   └── types/index.ts
├── backend/
│   ├── app/
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── services.py
│   ├── main.py
│   ├── seed.py
│   ├── requirements.txt
│   └── README.md
└── package.json
```

## Features Included

### Core
- Add, edit, delete transactions
- Income and expense tracking
- Categories (food, travel, bills, etc.)
- Total balance, income, expenses cards
- Data stored in backend + SQLite

### Advanced
- Authentication (signup/login, user-specific data)
- Dashboard analytics:
  - Pie chart for category spending
  - Monthly trend bars
- Budget management + over-budget alerts
- Recurring transactions (auto-added monthly on recurring day)
- Smart insights (top spending category)
- Search/filter transactions
- Dark mode toggle
- Responsive mobile + desktop layout

### Bonus
- Split expenses with friends (`split_with`)
- Receipt image upload endpoint
- Simple AI assistant endpoint for:
  - "How much did I spend this month?"
  - "Where can I save money?"

## Step-by-Step Setup

### 1) Backend setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```

Demo login:
- `demo@tracker.app`
- `demo1234`

### 2) Frontend setup (React)

In a new terminal from repo root:

```bash
npm install
npm run dev
```

Frontend runs on Vite default (`http://localhost:5173`).
It points to backend at `http://localhost:8000` by default.

If you want custom API URL, create `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoint Map

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`
- `POST /api/transactions/{id}/receipt`
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/dashboard`
- `GET /api/insights`
- `GET /api/assistant`

## Sample Data

`python seed.py` creates:
- one demo user
- sample income and expenses
- recurring subscription transaction
- split expense example
- starter budgets

## Deployment-Ready Notes

- Frontend can be deployed on Vercel/Netlify.
- Backend can be deployed to Render/Fly.io/EC2.
- For production:
  - move secrets to environment variables
  - lock CORS to frontend domain
  - use persistent volume for SQLite or migrate to Postgres

