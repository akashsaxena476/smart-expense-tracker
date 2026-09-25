from datetime import date

from .connection import SessionLocal
from .models import Expense


def create_expense(
    user_id: int,
    title: str,
    amount: float,
    category: str,
    expense_date: date
):
    db = SessionLocal()

    try:
        expense = Expense(
            user_id=user_id,
            title=title,
            amount=amount,
            category=category,
            date=expense_date
        )

        db.add(expense)
        db.commit()
        db.refresh(expense)

        return expense

    finally:
        db.close()


def get_all_expenses(user_id: int):
    db = SessionLocal()

    try:
        return (
            db.query(Expense)
            .filter(Expense.user_id == user_id)
            .order_by(Expense.id)
            .all()
        )

    finally:
        db.close()


def get_expenses_by_category(
    category: str,
    user_id: int
):
    db = SessionLocal()

    try:
        return (
            db.query(Expense)
            .filter(
                Expense.category.ilike(category),
                Expense.user_id == user_id
            )
            .all()
        )

    finally:
        db.close()


def get_expense_by_id(
    expense_id: int,
    user_id: int
):
    db = SessionLocal()

    try:
        return (
            db.query(Expense)
            .filter(
                Expense.id == expense_id,
                Expense.user_id == user_id
            )
            .first()
        )

    finally:
        db.close()


def delete_expense(
    expense_id: int,
    user_id: int
):
    db = SessionLocal()

    try:
        expense = (
            db.query(Expense)
            .filter(
                Expense.id == expense_id,
                Expense.user_id == user_id
            )
            .first()
        )

        if expense is None:
            return False

        db.delete(expense)
        db.commit()

        return True

    finally:
        db.close()


def update_expense(
    expense_id: int,
    user_id: int,
    title: str,
    amount: float,
    category: str,
    expense_date: date
):
    db = SessionLocal()

    try:
        expense = (
            db.query(Expense)
            .filter(
                Expense.id == expense_id,
                Expense.user_id == user_id
            )
            .first()
        )

        if expense is None:
            return None

        expense.title = title
        expense.amount = amount
        expense.category = category
        expense.date = expense_date

        db.commit()
        db.refresh(expense)

        return expense

    finally:
        db.close()