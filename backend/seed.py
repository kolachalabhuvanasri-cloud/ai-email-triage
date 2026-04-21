from app.database import Base, engine, SessionLocal
from app.models import User, Transaction, Budget
from app.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

user = db.query(User).filter(User.email == "demo@tracker.app").first()
if not user:
    user = User(name="Demo User", email="demo@tracker.app", password_hash=hash_password("demo1234"))
    db.add(user)
    db.commit()
    db.refresh(user)

sample_transactions = [
    ("Salary", 4200, "income", "salary", "2026-04-01", "Monthly salary", False, None, ""),
    ("Groceries", 180, "expense", "food", "2026-04-03", "Weekly groceries", False, None, ""),
    ("Netflix", 15, "expense", "subscriptions", "2026-04-05", "Streaming", True, 5, ""),
    ("Electricity Bill", 90, "expense", "bills", "2026-04-07", "Power bill", False, None, ""),
    ("Dinner Split", 75, "expense", "food", "2026-04-10", "Dinner with friends", False, None, "Alex,Sam"),
]

for title, amount, tx_type, category, date, notes, recurring, recurring_day, split in sample_transactions:
    exists = db.query(Transaction).filter(
        Transaction.user_id == user.id,
        Transaction.title == title,
        Transaction.transaction_date == date,
    ).first()
    if not exists:
        db.add(
            Transaction(
                user_id=user.id,
                title=title,
                amount=amount,
                type=tx_type,
                category=category,
                transaction_date=date,
                notes=notes,
                is_recurring=recurring,
                recurring_day=recurring_day,
                split_with=split,
            )
        )

budgets = [
    ("food", "2026-04", 300),
    ("bills", "2026-04", 200),
    ("subscriptions", "2026-04", 50),
]
for category, month, amount in budgets:
    exists = db.query(Budget).filter(Budget.user_id == user.id, Budget.category == category, Budget.month == month).first()
    if not exists:
        db.add(Budget(user_id=user.id, category=category, month=month, amount=amount))

db.commit()
db.close()
print("Seed data created. Demo login: demo@tracker.app / demo1234")
