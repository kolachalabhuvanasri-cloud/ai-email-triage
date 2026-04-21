from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class TransactionBase(BaseModel):
    title: str
    amount: float
    type: str
    category: str
    transaction_date: str
    notes: str = ""
    is_recurring: bool = False
    recurring_day: Optional[int] = None
    split_with: List[str] = []


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    transaction_date: Optional[str] = None
    notes: Optional[str] = None
    is_recurring: Optional[bool] = None
    recurring_day: Optional[int] = None
    split_with: Optional[List[str]] = None


class BudgetCreate(BaseModel):
    category: str
    month: str
    amount: float
