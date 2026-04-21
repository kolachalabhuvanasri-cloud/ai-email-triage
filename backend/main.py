import os
from datetime import datetime
from uuid import uuid4
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from app.models import User, Transaction, Budget
from app.schemas import UserSignup, UserLogin, TokenResponse, TransactionCreate, TransactionUpdate, BudgetCreate
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.services import compute_dashboard, recurring_seed_if_needed, parse_split

Base.metadata.create_all(bind=engine)
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="Personal Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/auth/signup", response_model=TokenResponse)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(name=payload.name, email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}


@app.get("/api/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}


@app.post("/api/transactions")
def create_transaction(
    payload: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = Transaction(
        user_id=current_user.id,
        title=payload.title,
        amount=payload.amount,
        type=payload.type,
        category=payload.category,
        transaction_date=payload.transaction_date,
        notes=payload.notes,
        is_recurring=payload.is_recurring,
        recurring_day=payload.recurring_day,
        split_with=",".join(payload.split_with),
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return {"message": "Transaction created", "id": tx.id}


@app.get("/api/transactions")
def list_transactions(
    search: str = "",
    category: str = "",
    tx_type: str = "",
    month: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recurring_seed_if_needed(db, current_user.id)
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if search:
        query = query.filter(Transaction.title.ilike(f"%{search}%"))
    if category:
        query = query.filter(Transaction.category == category)
    if tx_type:
        query = query.filter(Transaction.type == tx_type)

    records = query.order_by(Transaction.transaction_date.desc(), Transaction.id.desc()).all()
    if month:
        records = [r for r in records if r.transaction_date.startswith(month)]

    return [
        {
            "id": r.id,
            "title": r.title,
            "amount": r.amount,
            "type": r.type,
            "category": r.category,
            "transaction_date": r.transaction_date,
            "notes": r.notes,
            "receipt_path": r.receipt_path,
            "is_recurring": r.is_recurring,
            "recurring_day": r.recurring_day,
            "split_with": parse_split(r.split_with),
        }
        for r in records
    ]


@app.put("/api/transactions/{transaction_id}")
def update_transaction(
    transaction_id: int,
    payload: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        if field == "split_with":
            setattr(tx, field, ",".join(value))
        else:
            setattr(tx, field, value)

    db.commit()
    return {"message": "Transaction updated"}


@app.delete("/api/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"message": "Transaction deleted"}


@app.post("/api/transactions/{transaction_id}/receipt")
def upload_receipt(
    transaction_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    extension = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid4().hex}{extension}"
    path = os.path.join("uploads", filename)
    with open(path, "wb") as output:
        output.write(file.file.read())

    tx.receipt_path = path
    db.commit()
    return {"message": "Receipt uploaded", "path": path}


@app.post("/api/budgets")
def upsert_budget(
    payload: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category == payload.category,
        Budget.month == payload.month,
    ).first()

    if budget:
        budget.amount = payload.amount
    else:
        budget = Budget(user_id=current_user.id, category=payload.category, month=payload.month, amount=payload.amount)
        db.add(budget)

    db.commit()
    return {"message": "Budget saved"}


@app.get("/api/budgets")
def list_budgets(month: str = "", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Budget).filter(Budget.user_id == current_user.id)
    if month:
        query = query.filter(Budget.month == month)
    records = query.all()
    return [{"id": b.id, "category": b.category, "month": b.month, "amount": b.amount} for b in records]


@app.get("/api/dashboard")
def dashboard(month: str = datetime.utcnow().strftime("%Y-%m"), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return compute_dashboard(db, current_user.id, month)


@app.get("/api/insights")
def insights(month: str = datetime.utcnow().strftime("%Y-%m"), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = compute_dashboard(db, current_user.id, month)
    return {"insight": data["insight"], "budget_alerts": data["budget_alerts"]}


@app.get("/api/assistant")
def assistant(query: str, month: str = datetime.utcnow().strftime("%Y-%m"), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = compute_dashboard(db, current_user.id, month)
    q = query.lower()
    if "how much" in q and "this month" in q:
        return {"answer": f"You spent ${data['summary']['expenses']:.2f} in {month}."}
    if "save money" in q or "where can i save" in q:
        category_spending = data["category_spending"]
        if category_spending:
            biggest = max(category_spending, key=category_spending.get)
            return {"answer": f"Try reducing {biggest}. It is your biggest expense bucket this month."}
        return {"answer": "Add a few expenses first and I can suggest where to save."}
    return {"answer": "Ask me about this month spending or where to save money."}
