from collections import defaultdict
from datetime import datetime
from sqlalchemy.orm import Session
from .models import Transaction, Budget


def parse_split(split_with: str):
    return [item for item in split_with.split(",") if item]


def recurring_seed_if_needed(db: Session, user_id: int):
    today = datetime.utcnow()
    month = today.strftime("%Y-%m")
    day = today.day

    recurring_items = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.is_recurring == True,
        Transaction.recurring_day == day,
    ).all()

    for item in recurring_items:
        exists = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.title == item.title,
            Transaction.transaction_date == f"{month}-{day:02d}",
            Transaction.notes.like("%[AUTO-RECURRING]%"),
        ).first()
        if not exists:
            clone = Transaction(
                user_id=user_id,
                title=item.title,
                amount=item.amount,
                type=item.type,
                category=item.category,
                transaction_date=f"{month}-{day:02d}",
                notes=f"[AUTO-RECURRING] {item.notes}",
                receipt_path=item.receipt_path,
                is_recurring=False,
                recurring_day=None,
                split_with=item.split_with,
            )
            db.add(clone)
    db.commit()


def compute_dashboard(db: Session, user_id: int, month: str):
    txs = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    income = sum(t.amount for t in txs if t.type == "income")
    expenses = sum(t.amount for t in txs if t.type == "expense")
    balance = income - expenses

    month_txs = [t for t in txs if t.transaction_date.startswith(month)]
    category_spend = defaultdict(float)
    for t in month_txs:
        if t.type == "expense":
            category_spend[t.category] += t.amount

    trend = defaultdict(float)
    for t in txs:
        if t.type == "expense":
            trend[t.transaction_date[:7]] += t.amount

    budgets = db.query(Budget).filter(Budget.user_id == user_id, Budget.month == month).all()
    budget_alerts = []
    for budget in budgets:
        used = category_spend.get(budget.category, 0)
        if used > budget.amount:
            budget_alerts.append(
                {
                    "category": budget.category,
                    "budget": budget.amount,
                    "used": used,
                    "message": f"Budget exceeded for {budget.category}: ${used:.2f} / ${budget.amount:.2f}",
                }
            )

    top_category = None
    if category_spend:
        top_category = max(category_spend, key=category_spend.get)

    insight = "Looks balanced this month."
    if top_category:
        insight = f"You spent the most on {top_category} this month (${category_spend[top_category]:.2f})."

    return {
        "summary": {"balance": balance, "income": income, "expenses": expenses},
        "category_spending": category_spend,
        "monthly_trend": trend,
        "budget_alerts": budget_alerts,
        "insight": insight,
    }
