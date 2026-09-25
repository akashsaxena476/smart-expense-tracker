from datetime import date

from src.data_handler import load_expenses, save_expenses

from database.operations import (
    create_expense as create_postgres_expense,
    get_all_expenses as get_postgres_expenses,
    get_expense_by_id as get_postgres_expense_by_id,
    update_expense as update_postgres_expense,
    delete_expense as delete_postgres_expense,
)


# Change this to "json" whenever you want to use expenses.json
STORAGE_TYPE = "postgres"


def _postgres_to_dict(expense):
    return {
        "id": expense.id,
        "user_id": expense.user_id,
        "title": expense.title,
        "amount": expense.amount,
        "category": expense.category,
        "date": expense.date.isoformat()
    }


def get_all_expenses(user_id: int):
    if STORAGE_TYPE == "json":
        return load_expenses()

    expenses = get_postgres_expenses(user_id=user_id)

    return [
        _postgres_to_dict(expense)
        for expense in expenses
    ]


def create_expense(
    user_id: int,
    title: str,
    amount: float,
    category: str,
    expense_date: date
):
    if STORAGE_TYPE == "json":
        expenses = load_expenses()

        if expenses:
            expense_id = max(item["id"] for item in expenses) + 1
        else:
            expense_id = 1

        new_expense = {
            "id": expense_id,
            "title": title,
            "amount": amount,
            "category": category,
            "date": expense_date.isoformat()
        }

        expenses.append(new_expense)
        save_expenses(expenses)

        return new_expense

    expense = create_postgres_expense(
        user_id=user_id,
        title=title,
        amount=amount,
        category=category,
        expense_date=expense_date
    )

    return _postgres_to_dict(expense)


def delete_expense(
    expense_id: int,
    user_id: int
):
    if STORAGE_TYPE == "json":
        expenses = load_expenses()

        expense = next(
            (
                expense
                for expense in expenses
                if expense["id"] == expense_id
            ),
            None
        )

        if expense is None:
            return False

        expenses.remove(expense)
        save_expenses(expenses)

        return True

    return delete_postgres_expense(
        expense_id=expense_id,
        user_id=user_id
    )


def get_expense_by_id(
    expense_id: int,
    user_id: int
):
    if STORAGE_TYPE == "json":
        expenses = load_expenses()

        return next(
            (expense for expense in expenses if expense["id"] == expense_id),
            None
        )

    expense = get_postgres_expense_by_id(
        expense_id=expense_id,
        user_id=user_id
    )

    if expense is None:
        return None

    return _postgres_to_dict(expense)


def update_expense(
    expense_id: int,
    user_id: int,
    title: str,
    amount: float,
    category: str,
    expense_date: date
):
    if STORAGE_TYPE == "json":
        expenses = load_expenses()

        expense = next(
            (expense for expense in expenses if expense["id"] == expense_id),
            None
        )

        if expense is None:
            return None

        expense["title"] = title
        expense["amount"] = amount
        expense["category"] = category
        expense["date"] = expense_date.isoformat()

        save_expenses(expenses)

        return expense

    expense = update_postgres_expense(
        expense_id=expense_id,
        user_id=user_id,
        title=title,
        amount=amount,
        category=category,
        expense_date=expense_date
    )

    if expense is None:
        return None

    return _postgres_to_dict(expense)


def get_expenses_by_date_range(
    start_date: date,
    end_date: date,
    user_id: int
):
    expenses = get_all_expenses(user_id=user_id)

    return [
        expense
        for expense in expenses
        if start_date <= date.fromisoformat(expense["date"]) <= end_date
    ]